# Arquiteturas de Computadores

  > Guia completo e interativo de Arquiteturas de Computadores em Português Brasileiro

  🌐 **[Acesse o guia online](https://wallysondevs.github.io/computer-arch-guide/)**

  ---

  ## 📚 Conteúdo

  35 tópicos interativos organizados em 8 seções:

  ### 1. Fundamentos Digitais
  - Introdução à Arquitetura de Computadores
  - Representação de Dados (binário, hexadecimal, ponto flutuante)
  - Álgebra Booleana e Portas Lógicas
  - Circuitos Combinacionais (somadores, multiplexadores, decodificadores)
  - Circuitos Sequenciais (flip-flops, registradores, máquinas de estado)

  ### 2. O Processador
  - Organização da CPU (ALU, registradores, unidade de controle)
  - Ciclo de Instrução (fetch, decode, execute, writeback)
  - Conjunto de Instruções — ISA
  - Modos de Endereçamento
  - Pipeline (hazards, dependências, branch prediction)

  ### 3. Hierarquia de Memória
  - Hierarquia de Memória e princípios de localidade
  - Cache (mapeamento, políticas, coerência)
  - RAM e tipos de memória
  - Armazenamento (HDD, SSD, NVMe)
  - Memória Virtual (paginação, TLB, page faults)

  ### 4. Entrada e Saída
  - Barramentos (PCIe, USB, I²C, SPI)
  - Interrupções e tratamento de exceções
  - DMA (Direct Memory Access)
  - Dispositivos de E/S e controladores

  ### 5. Arquiteturas CISC e RISC
  - CISC vs RISC — filosofias e tradeoffs
  - Arquitetura x86 e x86-64
  - Arquitetura ARM
  - RISC-V — open-source ISA

  ### 6. Paralelismo e Performance
  - Multicore e hyperthreading
  - SMP e NUMA
  - GPU e SIMD
  - Processadores superescalares e out-of-order

  ### 7. Computação Especializada
  - ASICs e FPGAs
  - Hardware para IA (TPUs, NPUs)
  - Computação de borda (edge computing)
  - HPC e supercomputadores

  ### 8. Tópicos Avançados
  - Segurança em Hardware (Spectre, Meltdown, TPM)
  - Computação Quântica (qubits, algoritmos quânticos)
  - Tendências e o Futuro (chiplets, DSAs, Lei de Moore)

  ---

  ## 🛠 Stack Tecnológica

  | Tecnologia | Uso |
  |------------|-----|
  | React 19 | Framework UI |
  | TypeScript | Tipagem estática |
  | Vite | Bundler e dev server |
  | Tailwind CSS | Estilização |
  | Framer Motion | Animações |
  | next-themes | Dark mode |
  | wouter | Roteamento hash-based |
  | react-syntax-highlighter | Blocos de código com syntax highlighting |
  | Lucide React | Ícones |

  ## 🚀 Desenvolvimento Local

  ```bash
  # Clone o repositório
  git clone https://github.com/Wallysondevs/computer-arch-guide.git
  cd computer-arch-guide

  # Instale as dependências (requer pnpm)
  pnpm install

  # Inicie o servidor de desenvolvimento
  PORT=3000 BASE_PATH=/ pnpm run dev
  ```

  ## 📦 Build para Produção

  ```bash
  PORT=3000 BASE_PATH=/computer-arch-guide/ pnpm run build
  ```

  ---

  Feito com ❤️ por [Wallysondevs](https://github.com/Wallysondevs)
  