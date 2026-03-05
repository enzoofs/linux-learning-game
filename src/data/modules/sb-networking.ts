import type { Module } from '../../types';

export const sbNetworkingModule: Module = {
  id: 'sb-networking',
  title: 'Redes & Diagnostico',
  description: 'Diagnostique problemas de rede e entenda conexoes do sistema.',
  tier: 'Master',
  prerequisites: ['sb-curl', 'sb-disk'],
  isSideQuest: false,

  briefing: {
    concept:
      `No mundo real, servidores vivem conectados em rede. Saber diagnosticar problemas de conectividade é uma habilidade essencial para qualquer administrador de sistemas. Os comandos de rede do Linux permitem que você investigue cada camada da comunicação — desde o endereço IP local até a resolução de nomes DNS.\n\n` +
      `• **ip addr** — Mostra os endereços IP configurados nas interfaces de rede.\n` +
      `• **ip route** — Exibe a tabela de rotas, mostrando por onde o tráfego sai.\n` +
      `• **ss** — Substituto moderno do netstat, lista sockets e conexões ativas.\n` +
      `• **ping** — Testa conectividade básica enviando pacotes ICMP.\n` +
      `• **traceroute** — Mapeia o caminho dos pacotes até o destino.\n` +
      `• **dig / nslookup / host** — Ferramentas de consulta DNS.\n` +
      `• **nc (netcat)** — O "canivete suíço" da rede: testa portas, transfere dados.`,
    analogy:
      'Imagine a rede como um sistema de correios. `ip addr` mostra o endereço da sua casa. `ip route` mostra qual caminho o carteiro usa. `ping` é como enviar uma carta e esperar confirmação de recebimento. `traceroute` rastreia cada agência por onde a carta passou. `dig` consulta a lista telefônica (DNS) para traduzir nomes em endereços.',
    syntax:
      'ip addr [show]\nip route [show]\nss [-tulnp]\nping [-c count] host\ntraceroute host\ndig domain\nnslookup domain\nhost domain\nnc [-zv] host port',
    commandBreakdowns: [
      {
        title: 'Anatomia do ss (Socket Statistics)',
        command: 'ss -tulnp',
        parts: [
          { text: 'ss', label: 'Socket Statistics — substituto moderno do netstat' },
          { text: '-t', label: 'Mostra conexões TCP' },
          { text: '-u', label: 'Mostra conexões UDP' },
          { text: '-l', label: 'Apenas sockets em estado LISTEN (esperando conexões)' },
          { text: '-n', label: 'Numérico — mostra portas como números (não resolve nomes de serviço)' },
          { text: '-p', label: 'Mostra o processo associado a cada socket (requer sudo para todos)' },
        ],
      },
      {
        title: 'Consulta DNS com dig',
        command: 'dig +short MX google.com',
        parts: [
          { text: 'dig', label: 'Domain Information Groper — ferramenta de consulta DNS' },
          { text: '+short', label: 'Formato resumido — mostra apenas a resposta, sem headers' },
          { text: 'MX', label: 'Tipo de registro DNS (MX = Mail Exchange; outros: A, AAAA, CNAME, NS, TXT)' },
          { text: 'google.com', label: 'O domínio a consultar' },
        ],
      },
    ],
    examples: [
      { command: 'ip addr show', output: '1: lo: <LOOPBACK> ... inet 127.0.0.1/8\n2: eth0: ... inet 192.168.1.50/24', explanation: 'Mostra todas as interfaces de rede e seus endereços IP.' },
      { command: 'ip route show', output: 'default via 192.168.1.1 dev eth0\n192.168.1.0/24 dev eth0 proto kernel', explanation: 'Exibe a tabela de rotas — o gateway padrão é 192.168.1.1.' },
      { command: 'ss -tulnp', output: 'tcp  LISTEN  0  128  0.0.0.0:22  0.0.0.0:*  users:(("sshd",pid=1234))', explanation: 'Lista todas as portas TCP/UDP em escuta com o processo associado.' },
      { command: 'ping -c 3 8.8.8.8', output: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=10.2 ms\n--- 3 packets transmitted, 3 received, 0% packet loss', explanation: 'Envia exatamente 3 pacotes ICMP para o DNS do Google.' },
      { command: 'dig google.com', output: ';; ANSWER SECTION:\ngoogle.com. 300 IN A 142.250.79.46', explanation: 'Consulta DNS detalhada — mostra o registro A do domínio.' },
      { command: 'traceroute 8.8.8.8', output: ' 1  192.168.1.1  1.2 ms\n 2  10.0.0.1  5.4 ms\n 3  8.8.8.8  10.1 ms', explanation: 'Rastreia cada salto (hop) até o destino, revelando o caminho na rede.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ip\s+addr(\s+show)?$/, output: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0' },
      { pattern: /^ip\s+route(\s+show)?$/, output: 'default via 192.168.1.1 dev eth0 proto dhcp metric 100\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50' },
      { pattern: /^ss\s+-tulnp$/, output: 'Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process\ntcp    LISTEN  0       128     0.0.0.0:22           0.0.0.0:*          users:(("sshd",pid=1234,fd=3))\ntcp    LISTEN  0       511     0.0.0.0:80           0.0.0.0:*          users:(("nginx",pid=5678,fd=6))\ntcp    LISTEN  0       128     0.0.0.0:443          0.0.0.0:*          users:(("nginx",pid=5678,fd=7))' },
      { pattern: /^ping\s+-c\s+\d+\s+.+/, output: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=10.2 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=9.8 ms\n64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=10.5 ms\n\n--- 8.8.8.8 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms' },
      { pattern: /^ping\s+[^-]/, output: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=10.2 ms\n(use -c N para limitar o número de pacotes)' },
      { pattern: /^traceroute\s+.+/, output: 'traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets\n 1  gateway (192.168.1.1)  1.234 ms  1.112 ms  1.056 ms\n 2  10.0.0.1 (10.0.0.1)  5.432 ms  5.321 ms  5.210 ms\n 3  dns.google (8.8.8.8)  10.123 ms  10.045 ms  9.987 ms' },
      { pattern: /^dig\s+\S+/, output: '; <<>> DiG 9.18.1 <<>> google.com\n;; ANSWER SECTION:\ngoogle.com.\t\t300\tIN\tA\t142.250.79.46\n\n;; Query time: 12 msec\n;; SERVER: 192.168.1.1#53(192.168.1.1)' },
      { pattern: /^nslookup\s+\S+/, output: 'Server:\t\t192.168.1.1\nAddress:\t192.168.1.1#53\n\nNon-authoritative answer:\nName:\tgoogle.com\nAddress: 142.250.79.46' },
      { pattern: /^host\s+\S+/, output: 'google.com has address 142.250.79.46\ngoogle.com has IPv6 address 2800:3f0:4001:82a::200e\ngoogle.com mail is handled by 10 smtp.google.com.' },
      { pattern: /^nc\s+/, output: 'Connection to 192.168.1.50 22 port [tcp/ssh] succeeded!' },
    ],
    contextHints: [
      'Tente `ip addr` para ver os endereços IP das suas interfaces de rede.',
      'Use `ss -tulnp` para descobrir quais portas estão em escuta.',
      'Teste conectividade com `ping -c 3 8.8.8.8`.',
      'Use `dig google.com` para fazer uma consulta DNS.',
      'Rastreie o caminho até um host com `traceroute 8.8.8.8`.',
    ],
  },

  drills: [
    {
      id: 'net-drill-1',
      prompt: 'Mostre todos os endereços IP configurados nas interfaces de rede deste sistema.',
      difficulty: 'easy',
      check: (cmd) => /^ip\s+addr(\s+show)?$/.test(cmd.trim()),
      expectedOutput: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0',
      hints: ['O comando moderno para ver interfaces de rede é `ip`. Qual subcomando mostra endereços?', 'Use `ip addr` ou `ip addr show` para listar as interfaces e seus IPs.'],
      feedbackRules: [
        { pattern: /^ifconfig$/, message: '`ifconfig` é legado! O comando moderno é `ip addr`.' },
        { pattern: /^ip\s+link/, message: '`ip link` mostra as interfaces, mas sem endereços IP. Use `ip addr`.' },
      ],
      xp: 80,
    },
    {
      id: 'net-drill-2',
      prompt: 'Liste todas as portas TCP e UDP em escuta, mostrando os números das portas e os processos associados.',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        if (!/^ss\s+-[tulnp]+$/.test(trimmed)) return false;
        const flags = trimmed.replace('ss -', '');
        return flags.includes('t') && flags.includes('u') && flags.includes('l') && flags.includes('n') && flags.includes('p');
      },
      expectedOutput: 'Netid  State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process\ntcp    LISTEN  0       128     0.0.0.0:22           0.0.0.0:*          users:(("sshd",pid=1234,fd=3))\ntcp    LISTEN  0       511     0.0.0.0:80           0.0.0.0:*          users:(("nginx",pid=5678,fd=6))',
      hints: ['O comando `ss` substitui o antigo `netstat`. Você precisa de flags para: TCP, UDP, listening, numérico, processos.', 'Use `ss -tulnp`: t=TCP, u=UDP, l=listening, n=numérico, p=processos.'],
      feedbackRules: [
        { pattern: /^netstat/, message: '`netstat` é legado! Use `ss` — é mais rápido e moderno.' },
        { pattern: /^ss\s+-tln$/, message: 'Faltam flags! Adicione `-u` para UDP e `-p` para mostrar processos.' },
      ],
      xp: 80,
    },
    {
      id: 'net-drill-3',
      prompt: 'Envie exatamente 4 pacotes ICMP para o endereço 8.8.8.8 e pare automaticamente.',
      difficulty: 'easy',
      check: (cmd) => /^ping\s+-c\s+4\s+8\.8\.8\.8$/.test(cmd.trim()),
      expectedOutput: 'PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=10.2 ms\n...\n4 packets transmitted, 4 received, 0% packet loss',
      hints: ['O `ping` no Linux roda infinitamente por padrão. Qual flag limita o número de pacotes?', 'Use `-c` (count) para definir o número de pacotes: `ping -c 4 8.8.8.8`.'],
      feedbackRules: [
        { pattern: /^ping\s+8\.8\.8\.8$/, message: 'Sem `-c`, o ping roda para sempre! Use `ping -c 4 8.8.8.8`.' },
        { pattern: /^ping\s+-c\s+[^4]\s+/, message: 'O número de pacotes deve ser exatamente 4. Use `ping -c 4`.' },
      ],
      xp: 80,
    },
    {
      id: 'net-drill-4',
      prompt: 'Faça uma consulta DNS para descobrir o endereço IP do domínio `github.com` usando o comando `dig`.',
      difficulty: 'medium',
      check: (cmd) => /^dig\s+github\.com$/.test(cmd.trim()),
      expectedOutput: '; <<>> DiG 9.18.1 <<>> github.com\n;; ANSWER SECTION:\ngithub.com.\t\t60\tIN\tA\t140.82.121.4',
      hints: ['O `dig` é a ferramenta mais completa para consultas DNS. Basta passar o domínio como argumento.', 'Digite `dig github.com` para obter o registro A (endereço IPv4) do domínio.'],
      feedbackRules: [
        { pattern: /^nslookup\s+github/, message: '`nslookup` funciona, mas este drill pede especificamente o `dig`.' },
        { pattern: /^host\s+github/, message: '`host` é mais simples, mas o drill pede `dig` para a saída detalhada.' },
      ],
      xp: 80,
    },
    {
      id: 'net-drill-5',
      prompt: 'Rastreie o caminho completo dos pacotes até o servidor 1.1.1.1, mostrando cada salto intermediário.',
      difficulty: 'hard',
      check: (cmd) => /^traceroute\s+1\.1\.1\.1$/.test(cmd.trim()),
      expectedOutput: 'traceroute to 1.1.1.1 (1.1.1.1), 30 hops max, 60 byte packets\n 1  gateway (192.168.1.1)  1.234 ms\n 2  10.0.0.1  5.432 ms\n 3  one.one.one.one (1.1.1.1)  10.123 ms',
      hints: ['Existe um comando que mostra cada roteador pelo qual o pacote passa até chegar ao destino.', 'Use `traceroute 1.1.1.1` para mapear o caminho até o servidor DNS da Cloudflare.'],
      feedbackRules: [
        { pattern: /^tracert\s+/, message: '`tracert` é do Windows! No Linux, o comando é `traceroute`.' },
        { pattern: /^ping\s+/, message: '`ping` testa conectividade, mas não mostra o caminho. Use `traceroute`.' },
      ],
      xp: 80,
    },
  ],

  boss: {
    title: 'O Diagnosticador de Redes',
    scenario: 'Um servidor de produção está com problemas de conectividade. Usuários reportam lentidão e falhas intermitentes. Você precisa diagnosticar o problema passo a passo, verificando cada camada da rede.',
    steps: [
      {
        id: 'boss-net-1',
        prompt: '> Primeiro, verifique se o servidor tem um endereço IP configurado corretamente. Mostre as interfaces de rede.',
        check: (cmd) => /^ip\s+addr(\s+show)?$/.test(cmd.trim()),
        expectedOutput: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0',
        hints: ['Comece verificando as interfaces de rede e seus endereços IP.', 'Use `ip addr` para ver todas as interfaces configuradas.'],
        feedbackRules: [
          { pattern: /^ifconfig$/, message: '`ifconfig` é obsoleto. Use o comando moderno: `ip addr`.' },
        ],
      },
      {
        id: 'boss-net-2',
        prompt: '> O IP está OK. Agora verifique quais serviços estão rodando — liste todas as portas em escuta com seus processos.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          if (!/^ss\s+-[tulnp]+$/.test(trimmed)) return false;
          const flags = trimmed.replace('ss -', '');
          return flags.includes('t') && flags.includes('u') && flags.includes('l') && flags.includes('n') && flags.includes('p');
        },
        expectedOutput: 'tcp    LISTEN  0  128  0.0.0.0:22   0.0.0.0:*  users:(("sshd",pid=1234))\ntcp    LISTEN  0  511  0.0.0.0:80   0.0.0.0:*  users:(("nginx",pid=5678))\ntcp    LISTEN  0  128  0.0.0.0:443  0.0.0.0:*  users:(("nginx",pid=5678))',
        hints: ['Você precisa ver portas TCP/UDP em escuta e quais processos as utilizam.', 'Use `ss -tulnp` para uma visão completa das portas abertas.'],
        feedbackRules: [
          { pattern: /^netstat/, message: 'Use `ss` em vez de `netstat` — é mais rápido e está disponível em sistemas modernos.' },
        ],
      },
      {
        id: 'boss-net-3',
        prompt: '> Os serviços estão rodando. Teste a conectividade com o gateway — envie 3 pacotes para 192.168.1.1.',
        check: (cmd) => /^ping\s+-c\s+3\s+192\.168\.1\.1$/.test(cmd.trim()),
        expectedOutput: 'PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.5 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.4 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.6 ms\n\n--- 192.168.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss',
        hints: ['Use `ping` com a flag `-c` para limitar o número de pacotes.', 'O comando completo é `ping -c 3 192.168.1.1`.'],
        feedbackRules: [
          { pattern: /^ping\s+192/, message: 'Lembre-se de usar `-c 3` para enviar exatamente 3 pacotes!' },
        ],
      },
      {
        id: 'boss-net-4',
        prompt: '> Gateway OK. O problema pode ser DNS! Verifique se a resolução de nomes está funcionando — consulte o domínio `api.example.com`.',
        check: (cmd) => /^dig\s+api\.example\.com$/.test(cmd.trim()),
        expectedOutput: '; <<>> DiG 9.18.1 <<>> api.example.com\n;; ANSWER SECTION:\napi.example.com.\t300\tIN\tA\t93.184.216.34\n\n;; Query time: 45 msec\n;; SERVER: 192.168.1.1#53(192.168.1.1)',
        hints: ['Use uma ferramenta de consulta DNS para verificar se o domínio resolve corretamente.', 'O comando `dig api.example.com` mostra a resolução DNS completa.'],
        feedbackRules: [
          { pattern: /^ping\s+api/, message: 'Ping testa conectividade, mas aqui precisamos verificar a resolução DNS. Use `dig`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-network-diagnostician',
  },

  achievements: ['network-basics', 'boss-network-diagnostician'],
};
