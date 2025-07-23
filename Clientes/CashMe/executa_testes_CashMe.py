import smtplib
from email.message import EmailMessage
import os
import subprocess
import shutil
from datetime import datetime

def organizar_htmls_antigos():
    pasta_html = 'cypress/reports/html'
    pasta_antigo = 'cypress/reports/html_antigo'

    os.makedirs(pasta_antigo, exist_ok=True)

    for arquivo in os.listdir(pasta_html):
        caminho_origem = os.path.join(pasta_html, arquivo)
        if os.path.isfile(caminho_origem):
            data_hora = datetime.now().strftime('%Y%m%d-%H%M%S')
            nome_base, extensao = os.path.splitext(arquivo)
            novo_nome = f"{data_hora}_{nome_base}{extensao}"
            caminho_destino = os.path.join(pasta_antigo, novo_nome)
            shutil.move(caminho_origem, caminho_destino)
            print(f'Movido: {arquivo} → {caminho_destino}')

def organizar_jsons_antigos():
    print('Organizando relatórios JSON anteriores...')
    pasta_json = 'cypress/reports/json'
    pasta_antigo = 'cypress/reports/json_antigo'

    os.makedirs(pasta_antigo, exist_ok=True)

    for arquivo in os.listdir(pasta_json):
        caminho_origem = os.path.join(pasta_json, arquivo)
        if arquivo.lower().startswith('mochawesome') and arquivo.endswith('.json'):
            data_hora = datetime.now().strftime('%Y%m%d-%H%M%S')
            nome_base, extensao = os.path.splitext(arquivo)
            novo_nome = f"{data_hora}_{nome_base}{extensao}"
            caminho_destino = os.path.join(pasta_antigo, novo_nome)
            shutil.move(caminho_origem, caminho_destino)
            print(f'Movido: {arquivo} → {caminho_destino}')

def executar_testes_cypress():
    print('Executando testes Cypress...')
    try:
        npx_path = shutil.which("npx")
        if npx_path is None:
            print("npx não encontrado no PATH.")
            exit(1)

        pasta_json = 'cypress/reports/json'
        mochawesome_json_path = os.path.join(pasta_json, 'mochawesome.json')

        specs = []
        for root, dirs, files in os.walk('cypress/e2e'):
            for file in files:
                if file.endswith('.cy.js'):
                    specs.append(os.path.join(root, file))
        if not specs:
            print("Nenhuma especificação encontrada.")
            return

        for spec in specs:
            print(f'Executando spec: {spec}')
            resultado = subprocess.run(
                [npx_path, 'cypress', 'run', '--spec', spec],
                check=False,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )

            if resultado.returncode != 0:
                print(f'⚠️ Teste com falha no spec: {spec}')
                print(f'Stdout:\n{resultado.stdout}')
                print(f'Stderr:\n{resultado.stderr}')
            else:
                print(f'✅ Teste passou no spec: {spec}')

            if os.path.exists(mochawesome_json_path):
                nome_arquivo = f"mochawesome_{os.path.splitext(os.path.basename(spec))[0]}.json"
                novo_json = os.path.join(pasta_json, nome_arquivo)
                shutil.move(mochawesome_json_path, novo_json)
                print(f'📄 JSON gerado e movido para {novo_json}')
            else:
                print(f'❌ JSON NÃO gerado para {spec}, verifique logs do Cypress.')

        arquivos_para_merge = [
            f for f in os.listdir(pasta_json)
            if f.startswith('mochawesome_') and f.endswith('.json')
        ]

        if os.path.exists(mochawesome_json_path):
            os.remove(mochawesome_json_path)

        if not arquivos_para_merge:
            print('⚠️ Nenhum JSON encontrado para merge.')
            return

        print('Unificando JSONs de relatórios...')
        with open(mochawesome_json_path, 'w', encoding='utf-8') as saida_json:
            subprocess.run(
                [npx_path, 'mochawesome-merge', '--files', 'mochawesome_*.json'],
                cwd=pasta_json,
                check=True,
                stdout=saida_json,
                text=True,
                encoding='utf-8'
            )

        print('Gerando relatório HTML consolidado...')
        subprocess.run(
            [
                npx_path, 'mochawesome-report-generator',
                mochawesome_json_path,
                '--reportDir', 'cypress/reports/html',
                '--inlineAssets'
            ],
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        print('✅ Relatório HTML gerado com sucesso.')

    except subprocess.CalledProcessError as e:
        print(f'Erro ao executar os testes ou gerar relatórios:\n{e.stderr}')
        exit(1)

def enviar_email_com_relatorio():
    remetente = 'marcos.ribeiro@prognum.com.br'
    senha = 'epgl upry pyhu sija'
    destinatarios = ['marcos.ribeiro@prognum.com.br']

    caminho_relatorio = 'cypress/reports/html/mochawesome.html'

    if not os.path.exists(caminho_relatorio):
        print(f'Relatório {caminho_relatorio} não encontrado.')
        return

    msg = EmailMessage()
    msg['Subject'] = 'Relatório de Testes Cypress'
    msg['From'] = remetente
    msg['To'] = ', '.join(destinatarios)
    msg.set_content('Segue em anexo o relatório de testes automatizados Cypress.')

    with open(caminho_relatorio, 'rb') as arq:
        conteudo = arq.read()
        msg.add_attachment(conteudo, maintype='text', subtype='html', filename='Relatorio_Cypress.html')

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.starttls()
            smtp.login(remetente, senha)
            smtp.send_message(msg)
        print('✅ E-mail enviado com sucesso.')
    except Exception as e:
        print(f'Erro ao enviar e-mail: {e}')

if __name__ == '__main__':
    organizar_htmls_antigos()
    organizar_jsons_antigos()
    executar_testes_cypress()
    enviar_email_com_relatorio()
