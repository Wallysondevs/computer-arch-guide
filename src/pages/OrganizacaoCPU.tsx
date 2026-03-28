import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OrganizacaoCPU() {
  return (
    <PageContainer
      title="Organização da CPU"
      subtitle="Os componentes internos de um processador e como eles trabalham juntos para executar instruções."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>A Unidade Central de Processamento</h2>
      <p>
        A CPU é o "cérebro" do computador. Ela busca instruções na memória, as decodifica e executa. Os componentes principais de uma CPU clássica são: Unidade de Controle, ALU, e banco de registradores — todos conectados por barramentos internos.
      </p>

      <h2>Registradores</h2>
      <p>
        Registradores são a memória mais rápida e cara do sistema — vivem dentro do chip, a centímetros dos circuitos de execução. Uma CPU moderna típica tem dezenas a centenas de registradores:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Program Counter (PC)", desc: "Aponta para o endereço da próxima instrução a ser buscada. Auto-incrementado após cada fetch." },
          { name: "Instruction Register (IR)", desc: "Contém a instrução atualmente sendo decodificada e executada pela UC." },
          { name: "Stack Pointer (SP)", desc: "Aponta para o topo da pilha de execução. Usado em chamadas de função (push/pop)." },
          { name: "General Purpose Registers", desc: "x86-64 tem 16 GPRs (RAX, RBX, etc.). ARM tem 31. RISC-V tem 32. Usados para operandos e resultados." },
          { name: "Flags / Status Register", desc: "Bits indicando resultado da última operação: Zero, Carry, Overflow, Negative, Parity." },
          { name: "Base e Index Registers", desc: "Usados em cálculo de endereços de memória com modos de endereçamento indexado." },
        ].map(r => (
          <div key={r.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{r.name}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      <h2>Unidade de Controle (UC)</h2>
      <p>
        A UC é o "maestro" da CPU. Ela interpreta o opcode de cada instrução e gera os sinais de controle que coordenam todos os outros componentes. Existem dois tipos:
      </p>
      <ul>
        <li><strong>Hardwired:</strong> lógica combinacional fixa, muito rápida. Usada em CPUs RISC.</li>
        <li><strong>Microprogramada:</strong> instruções são decompostas em micro-operações (microcode). Mais flexível, usada em CPUs CISC como x86 para compatibilidade.</li>
      </ul>

      <h2>ALU — Unidade Lógica e Aritmética</h2>
      <p>
        A ALU executa operações sobre inteiros. CPUs modernas têm múltiplas ALUs operando em paralelo, além de unidades especializadas:
      </p>
      <CodeBlock language="text" title="Componentes de execução em uma CPU moderna" code={`
Unidades de Execução:
  ALU(s):     Adição, subtração, comparação, lógica (AND/OR/XOR)
  Shifter:    Deslocamentos e rotações (SHL, SHR, SAR, ROL)
  Multiplier: Multiplicação inteira (pode ser iterativa ou combinacional)
  Divider:    Divisão inteira (mais lenta, às vezes em microcode)

Unidades de Ponto Flutuante (FPU):
  FADD, FSUB: Adição/subtração em float
  FMUL:       Multiplicação float
  FDIV:       Divisão float (mais lenta)
  FMA:        Fused Multiply-Add (a*b + c em um passo, sem arredondamento intermediário)
  SQRT:       Raiz quadrada

Unidades SIMD (vetoriais):
  SSE/AVX:    Opera em múltiplos floats/ints simultaneamente
  Ex: AVX-512 processa 16 floats de 32-bit em paralelo
      `} />

      <h2>Barramentos Internos</h2>
      <p>
        Dentro da CPU, os componentes se comunicam por barramentos internos:
      </p>
      <CodeBlock language="text" title="Estrutura de barramento de 3 vias (clássico)" code={`
[Reg File]──A──▶[ALU]──▶[Result Bus]──▶[Reg File / Memória]
            B──▶[ALU]

Barramento A: fonte do primeiro operando
Barramento B: fonte do segundo operando
Barramento Result: destino do resultado

CPUs modernas usam múltiplos barramentos e portas de leitura/escrita
no banco de registradores para suportar execução paralela de instruções.
      `} />

      <h2>Interface com a Memória</h2>
      <p>A CPU se comunica com a hierarquia de memória via:</p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { name: "MAR (Memory Address Register)", desc: "Contém o endereço de memória a ser lido ou escrito." },
          { name: "MDR (Memory Data Register)", desc: "Contém o dado a ser escrito ou o dado lido da memória." },
          { name: "Cache Controller", desc: "Gerencia o acesso à hierarquia de cache (L1/L2/L3) antes de chegar à RAM." },
        ].map(m => (
          <div key={m.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-xs mb-1">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2>Diagrama da CPU Clássica (Von Neumann)</h2>
      <CodeBlock language="text" title="Organização simplificada" code={`
                    ┌─────────────────────────────┐
                    │           CPU               │
                    │                             │
                    │  ┌──────────┐  ┌─────────┐  │
                    │  │   UC     │  │  Reg.   │  │
     Instrução ───▶│  │(decodif.)│  │  File   │  │
                    │  └────┬─────┘  └────┬────┘  │
                    │       │ sinais       │ A, B  │
                    │       ▼             ▼       │
                    │  ┌─────────────────────┐    │
                    │  │        ALU          │    │
                    │  └─────────┬───────────┘    │
                    │            │ resultado       │
                    │       ┌────▼────┐           │
                    │       │  Flags  │           │
                    └───────┴─────────┴───────────┘
                                │
                    ┌───────────▼───────────────────┐
                    │        Barramento do Sistema   │
                    │   (endereço + dados + controle)│
                    └──────┬────────────────────────┘
                           │
                    ┌──────▼──────┐  ┌──────────┐
                    │   Memória   │  │   I/O    │
                    │  (RAM/ROM)  │  │Dispositiv│
                    └─────────────┘  └──────────┘
      `} />

      <h2>CPUs Modernas: Muito Além do Clássico</h2>
      <p>CPUs atuais como Intel Core Ultra e AMD Ryzen incluem:</p>
      <ul>
        <li><strong>Múltiplos cores</strong> — cada um com sua própria UC, ALUs, FPU e cache L1/L2</li>
        <li><strong>Cache L3 compartilhado</strong> — dezenas de MB divididos entre os cores</li>
        <li><strong>Unidades de decodificação fora de ordem</strong> (OoO execution)</li>
        <li><strong>Branch predictor</strong> — adivinha o resultado de desvios condicionais</li>
        <li><strong>Prefetcher de hardware</strong> — busca dados da memória antecipadamente</li>
        <li><strong>Unidades vetoriais AVX-512</strong> — para IA e processamento de dados</li>
      </ul>

      <AlertBox type="info" title="Die shot: vendo a CPU de perto">
        Usando microscopia eletrônica, é possível ver a organização física dos componentes do chip. Ferramentas como o site Chips &amp; Cheese fazem análises detalhadas da microarquitetura de CPUs modernas.
      </AlertBox>
    </PageContainer>
  );
}
