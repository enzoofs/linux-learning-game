import type { Module } from '../../types';

export const sbHardeningModule: Module = {
  id: 'sb-hardening',
  title: 'Hardening & Seguranca',
  description: 'Proteja seu sistema contra ameacas com tecnicas de hardening.',
  tier: 'GrandMaster',
  prerequisites: ['sb-networking', 'sb-logs'],
  isSideQuest: false,

  briefing: {
    concept:
      `Hardening e o processo de fortalecer um sistema contra ataques, reduzindo sua superficie de ataque e eliminando vulnerabilidades. Um servidor exposto a internet sem hardening e como uma casa com todas as portas e janelas abertas.\n\n` +
      `As ferramentas e tecnicas essenciais de hardening no Linux:\n\n` +
      `• **ufw** (Uncomplicated Firewall) — Interface simplificada para o iptables. Controla quais portas estao abertas.\n` +
      `• **iptables** — O firewall de baixo nivel do kernel Linux. Regras granulares de filtragem de pacotes.\n` +
      `• **fail2ban** — Monitora logs e bane automaticamente IPs que tentam ataques de forca bruta.\n` +
      `• **openssl** — Toolkit criptografico para gerar certificados SSL/TLS, verificar conexoes seguras.\n` +
      `• **/etc/ssh/sshd_config** — Configuracao do servidor SSH: desabilitar root login, mudar porta, etc.\n` +
      `• **/etc/shadow** — Arquivo que armazena hashes de senhas dos usuarios (acessivel apenas pelo root).\n` +
      `• **ss/netstat** — Verificar portas abertas e conexoes ativas para detectar servicos expostos.`,
    analogy:
      'Pense no hardening como fortificar um castelo. O `ufw` e a muralha que decide quem entra e quem fica de fora. O `fail2ban` e o guarda que bane invasores reincidentes. O `openssl` e o selo real que garante a autenticidade das mensagens. E o `sshd_config` e o portao principal — voce precisa configurar quem tem a chave.',
    syntax:
      'sudo ufw status\nsudo ufw allow <porta>/<protocolo>\nsudo ufw deny <porta>\nsudo ufw enable\nfail2ban-client status\nopenssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes\nopenssl s_client -connect host:porta\nss -tlnp\nsudo cat /etc/shadow',
    examples: [
      { command: 'sudo ufw status', output: 'Status: active\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere\n443/tcp                    ALLOW       Anywhere\n80/tcp                     DENY        Anywhere', explanation: 'Mostra o status do firewall e todas as regras ativas.' },
      { command: 'sudo ufw allow 443/tcp', output: 'Rule added\nRule added (v6)', explanation: 'Libera a porta 443 (HTTPS) no firewall para conexoes TCP.' },
      { command: 'sudo ufw deny 23', output: 'Rule added\nRule added (v6)', explanation: 'Bloqueia a porta 23 (Telnet) — protocolo inseguro que nunca deveria estar aberto.' },
      { command: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes', output: 'Generating a RSA private key\n...++++\n...++++\nwriting new private key to \'key.pem\'\n-----', explanation: 'Gera um certificado SSL autoassinado com chave RSA de 4096 bits, valido por 365 dias.' },
      { command: 'ss -tlnp', output: 'State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      128    0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=1234))\nLISTEN 0      511    0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=5678))\nLISTEN 0      511    0.0.0.0:443         0.0.0.0:*         users:(("nginx",pid=5678))', explanation: 'Lista todas as portas TCP em escuta com os processos associados.' },
      { command: 'fail2ban-client status sshd', output: 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 3\n|  `- Total failed: 47\n`- Actions\n   |- Currently banned: 2\n   `- Total banned: 12', explanation: 'Mostra estatisticas do fail2ban para o servico SSH — falhas e IPs banidos.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^sudo\s+ufw\s+status$/, output: 'Status: active\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere\n443/tcp                    ALLOW       Anywhere\n80/tcp                     ALLOW       Anywhere\n3306/tcp                   DENY        Anywhere' },
      { pattern: /^sudo\s+ufw\s+allow\s+/, output: 'Rule added\nRule added (v6)' },
      { pattern: /^sudo\s+ufw\s+deny\s+/, output: 'Rule added\nRule added (v6)' },
      { pattern: /^sudo\s+ufw\s+enable$/, output: 'Firewall is active and enabled on system startup' },
      { pattern: /^ss\s+-tlnp$/, output: 'State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      128    0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=1234))\nLISTEN 0      511    0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=5678))\nLISTEN 0      511    0.0.0.0:443         0.0.0.0:*         users:(("nginx",pid=5678))\nLISTEN 0      128    0.0.0.0:3306        0.0.0.0:*         users:(("mysqld",pid=9012))' },
      { pattern: /^fail2ban-client\s+status/, output: 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 3\n|  `- Total failed: 47\n`- Actions\n   |- Currently banned: 2\n   `- Total banned: 12' },
      { pattern: /^openssl\s+req\s+-x509/, output: 'Generating a RSA private key\n...........++++\n.......................++++\nwriting new private key to \'key.pem\'\n-----\nYou are about to be asked to enter information...\nCountry Name: BR\nOrganization Name: CLI Quest\nCommon Name: cli-quest.local' },
      { pattern: /^openssl\s+s_client/, output: 'CONNECTED(00000003)\ndepth=2 O = Digital Signature Trust Co., CN = DST Root CA X3\nverify return:1\n---\nSSL handshake has read 3456 bytes and written 789 bytes\nNew, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384\nServer public key is 4096 bit' },
      { pattern: /^sudo\s+cat\s+\/etc\/shadow/, output: 'root:$6$xyz...:19500:0:99999:7:::\ndaemon:*:19000:0:99999:7:::\nenzo:$6$abc...:19600:0:99999:7:::' },
      { pattern: /^(sudo\s+)?cat\s+\/etc\/ssh\/sshd_config/, output: '#Port 22\n#PermitRootLogin prohibit-password\nPermitRootLogin yes\n#PasswordAuthentication yes\nPasswordAuthentication yes\n#PubkeyAuthentication yes\nUsePAM yes\nX11Forwarding yes\nAcceptEnv LANG LC_*\nSubsystem sftp /usr/lib/openssh/sftp-server' },
    ],
    contextHints: [
      'Comece com `sudo ufw status` para ver o estado atual do firewall.',
      'Use `ss -tlnp` para descobrir quais portas estao abertas no servidor.',
      'Tente `fail2ban-client status sshd` para ver estatisticas de protecao do SSH.',
      'Experimente `openssl s_client -connect google.com:443` para testar uma conexao SSL.',
      'Veja a configuracao do SSH com `cat /etc/ssh/sshd_config`.',
    ],
  },

  drills: [
    {
      id: 'hardening-drill-1',
      prompt: 'Verifique o status atual do firewall UFW para saber quais regras estao ativas.',
      difficulty: 'easy',
      check: (cmd) => /^sudo\s+ufw\s+status$/.test(cmd.trim()),
      expectedOutput: 'Status: active\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere\n443/tcp                    ALLOW       Anywhere',
      hints: ['O UFW tem um subcomando simples para mostrar seu estado atual.', 'Use `sudo ufw status` para ver as regras do firewall.'],
      feedbackRules: [
        { pattern: /^ufw\s+status$/, message: 'Verificar o firewall exige privilegios de root. Adicione `sudo`.' },
        { pattern: /^sudo\s+iptables\s+-L/, message: '`iptables -L` funciona, mas o UFW e a interface recomendada. Use `sudo ufw status`.' },
        { pattern: /^sudo\s+ufw\s+status\s+verbose/, message: 'O modo verbose mostra mais detalhes, mas para este exercicio `sudo ufw status` e suficiente.' },
      ],
      xp: 100,
    },
    {
      id: 'hardening-drill-2',
      prompt: 'Adicione uma regra no UFW para permitir conexoes na porta 443 (HTTPS) via TCP.',
      difficulty: 'medium',
      check: (cmd) => /^sudo\s+ufw\s+allow\s+443\/tcp$/.test(cmd.trim()),
      expectedOutput: 'Rule added\nRule added (v6)',
      hints: ['O UFW usa `allow` para liberar portas. Especifique porta/protocolo.', 'Use `sudo ufw allow 443/tcp` para liberar HTTPS.'],
      feedbackRules: [
        { pattern: /^sudo\s+ufw\s+allow\s+443$/, message: 'Quase! Especifique o protocolo tambem: `443/tcp`.' },
        { pattern: /^ufw\s+allow/, message: 'Modificar o firewall exige `sudo`. Adicione no inicio do comando.' },
      ],
      xp: 100,
    },
    {
      id: 'hardening-drill-3',
      prompt: 'Gere um certificado SSL autoassinado com chave RSA de 4096 bits, valido por 365 dias, salvando a chave em `key.pem` e o certificado em `cert.pem`, sem senha na chave privada.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^openssl\s+req\s+-x509\s+-newkey\s+rsa:4096\s+-keyout\s+key\.pem\s+-out\s+cert\.pem\s+-days\s+365\s+-nodes$/.test(trimmed);
      },
      expectedOutput: 'Generating a RSA private key\n...........++++\n.......................++++\nwriting new private key to \'key.pem\'',
      hints: ['O openssl usa `req -x509` para gerar certificados autoassinados. Use `-newkey rsa:4096` para o tamanho da chave.', 'O comando completo e: `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`.'],
      feedbackRules: [
        { pattern: /openssl.*req.*-x509/, message: 'Boa base! Verifique se tem `-newkey rsa:4096`, `-keyout key.pem`, `-out cert.pem`, `-days 365` e `-nodes`.' },
        { pattern: /openssl.*genrsa/, message: '`genrsa` gera apenas a chave. Para gerar chave + certificado de uma vez, use `openssl req -x509`.' },
      ],
      xp: 100,
    },
    {
      id: 'hardening-drill-4',
      prompt: 'Liste todas as portas TCP em escuta no sistema, mostrando os processos associados, sem resolver nomes.',
      difficulty: 'medium',
      check: (cmd) => /^ss\s+-tlnp$/.test(cmd.trim()),
      expectedOutput: 'State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      128    0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=1234))\nLISTEN 0      511    0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=5678))',
      hints: ['O comando `ss` e o substituto moderno do `netstat`. Use flags para filtrar TCP, escuta, numerico e processos.', 'As flags sao: `-t` (TCP), `-l` (listening), `-n` (numerico), `-p` (processos). Use `ss -tlnp`.'],
      feedbackRules: [
        { pattern: /^netstat\s+-tlnp$/, message: '`netstat` funciona, mas esta sendo substituido pelo `ss`. Use `ss -tlnp`.' },
        { pattern: /^ss\s+-tln$/, message: 'Quase! Adicione `-p` para ver os processos associados a cada porta.' },
        { pattern: /^ss\s+-a/, message: '`-a` mostra todas as conexoes. Use `-l` para filtrar apenas as que estao em escuta (LISTEN).' },
      ],
      xp: 100,
    },
    {
      id: 'hardening-drill-5',
      prompt: 'Use `sed` para desabilitar o login do root via SSH, alterando "PermitRootLogin yes" para "PermitRootLogin no" no arquivo `/etc/ssh/sshd_config`.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^sudo\s+sed\s+-i\s+'s\/PermitRootLogin\s+yes\/PermitRootLogin\s+no\/'\s+\/etc\/ssh\/sshd_config$/.test(trimmed);
      },
      expectedOutput: '',
      hints: ['Use `sed -i` para editar o arquivo in-place. A expressao substitui "PermitRootLogin yes" por "PermitRootLogin no".', 'O comando e: `sudo sed -i \'s/PermitRootLogin yes/PermitRootLogin no/\' /etc/ssh/sshd_config`.'],
      feedbackRules: [
        { pattern: /sed.*PermitRootLogin/, message: 'Boa! Verifique se voce tem `-i` para editar in-place e `sudo` para ter permissao de escrita.' },
        { pattern: /^sed\s+-i/, message: 'O arquivo `/etc/ssh/sshd_config` pertence ao root. Voce precisa de `sudo` para edita-lo.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'O Sentinela',
    scenario: 'ALERTA! Um servidor de producao foi parcialmente comprometido. Portas suspeitas estao abertas, o firewall esta desabilitado, o login root via SSH esta permitido e nao ha certificado SSL. Voce precisa endurecer este servidor antes que o atacante volte.',
    steps: [
      {
        id: 'boss-hardening-1',
        prompt: '> Primeiro, descubra quais portas TCP estao abertas no servidor. Precisamos saber a extensao do problema.',
        check: (cmd) => /^ss\s+-tlnp$/.test(cmd.trim()),
        expectedOutput: 'State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN 0      128    0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=1234))\nLISTEN 0      511    0.0.0.0:80          0.0.0.0:*         users:(("nginx",pid=5678))\nLISTEN 0      511    0.0.0.0:443         0.0.0.0:*         users:(("nginx",pid=5678))\nLISTEN 0      128    0.0.0.0:3306        0.0.0.0:*         users:(("mysqld",pid=9012))\nLISTEN 0      128    0.0.0.0:6379        0.0.0.0:*         users:(("redis",pid=3456))',
        hints: ['Use o comando que lista sockets TCP em escuta com nomes numericos e processos.', 'O comando e `ss -tlnp` — TCP, listening, numerico, processos.'],
        feedbackRules: [
          { pattern: /^netstat/, message: 'Use `ss` em vez de `netstat` — e mais moderno e recomendado.' },
        ],
      },
      {
        id: 'boss-hardening-2',
        prompt: '> A porta 3306 (MySQL) e 6379 (Redis) estao expostas! Bloqueie a porta 6379 no firewall imediatamente — Redis aberto e um perigo critico.',
        check: (cmd) => /^sudo\s+ufw\s+deny\s+6379$/.test(cmd.trim()),
        expectedOutput: 'Rule added\nRule added (v6)',
        hints: ['Use o UFW para negar conexoes nessa porta.', 'O comando e `sudo ufw deny 6379`.'],
        feedbackRules: [
          { pattern: /^sudo\s+ufw\s+deny\s+6379\/tcp$/, message: 'Bloquear apenas TCP deixa UDP aberto. Para bloquear tudo nessa porta, use `sudo ufw deny 6379` sem especificar protocolo.' },
          { pattern: /^ufw\s+deny/, message: 'Voce precisa de `sudo` para modificar regras do firewall.' },
        ],
      },
      {
        id: 'boss-hardening-3',
        prompt: '> Agora desabilite o login do root via SSH. Edite o arquivo `/etc/ssh/sshd_config` trocando "PermitRootLogin yes" por "PermitRootLogin no".',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^sudo\s+sed\s+-i\s+'s\/PermitRootLogin\s+yes\/PermitRootLogin\s+no\/'\s+\/etc\/ssh\/sshd_config$/.test(trimmed);
        },
        expectedOutput: '',
        hints: ['Use `sed -i` com `sudo` para fazer a substituicao diretamente no arquivo.', 'O comando e: `sudo sed -i \'s/PermitRootLogin yes/PermitRootLogin no/\' /etc/ssh/sshd_config`.'],
        feedbackRules: [
          { pattern: /sed.*PermitRootLogin/, message: 'Quase! Certifique-se de ter `sudo`, `-i` e o caminho correto do arquivo.' },
        ],
      },
      {
        id: 'boss-hardening-4',
        prompt: '> Por ultimo, gere um certificado SSL autoassinado para o servidor. Use RSA 4096 bits, validade de 365 dias, chave em `server.key` e certificado em `server.crt`, sem senha.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^openssl\s+req\s+-x509\s+-newkey\s+rsa:4096\s+-keyout\s+server\.key\s+-out\s+server\.crt\s+-days\s+365\s+-nodes$/.test(trimmed);
        },
        expectedOutput: 'Generating a RSA private key\n...........++++\n.......................++++\nwriting new private key to \'server.key\'\n-----\nCertificate generated successfully.',
        hints: ['Use `openssl req -x509` com os parametros de tamanho, validade e arquivos de saida.', 'O comando e: `openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 365 -nodes`.'],
        feedbackRules: [
          { pattern: /openssl.*req/, message: 'Boa base! Verifique os nomes dos arquivos: `server.key` e `server.crt`.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-sentinela',
  },

  achievements: ['security-hardener', 'boss-sentinela'],
};
