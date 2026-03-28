import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CircuitosSequenciais() {
  return (
    <PageContainer
      title="Circuitos Sequenciais"
      subtitle="Circuitos com memória — a base de registradores, contadores e máquinas de estado."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <h2>O que são Circuitos Sequenciais?</h2>
      <p>
        Ao contrário dos combinacionais, circuitos sequenciais têm <strong>memória</strong>: a saída depende não só das entradas atuais, mas também do estado interno (histórico de entradas anteriores). Isso é possível através de realimentação e elementos de armazenamento como flip-flops.
      </p>

      <h2>Latch SR (Set-Reset)</h2>
      <p>O latch SR é o elemento de memória mais simples. Usa duas portas NOR ou NAND em realimentação cruzada:</p>
      <CodeBlock language="text" title="Latch SR com portas NOR" code={`
Entradas: S (Set), R (Reset)
Saídas:   Q, Q̄ (complementar)

S  R | Q(t+1) | Ação
0  0 |  Q(t)  | Mantém estado (memória)
1  0 |   1    | Set (Q=1)
0  1 |   0    | Reset (Q=0)
1  1 |   ?    | Proibido! Estado indeterminado

Problema: entradas assíncronas → pode mudar a qualquer momento.
Solução: controlar quando o latch "escuta" com um sinal Enable → Latch D.
      `} />

      <h2>Flip-Flop D (Data/Delay)</h2>
      <p>
        O flip-flop D captura o valor da entrada D na <strong>borda do clock</strong> (subida ou descida). É o elemento de armazenamento mais usado em circuitos síncronos:
      </p>
      <CodeBlock language="text" title="Flip-flop D com borda de subida" code={`
Comportamento:
  Na borda de subida do CLK: Q ← D
  Entre bordas: Q mantém o valor anterior

Diagrama temporal:
CLK  ___⌐⌐___⌐⌐___⌐⌐___
D    _______⌐⌐⌐⌐________
Q    ___________⌐⌐⌐⌐____
             ↑ Q captura D na borda de subida do CLK

Parâmetros críticos:
  Setup time (tsu): D deve ser estável ANTES da borda do CLK
  Hold time (th):   D deve permanecer estável DEPOIS da borda
  Clock-to-Q (tcq): atraso entre borda e mudança de Q
      `} />

      <h2>Flip-Flop JK</h2>
      <p>Versão mais versátil: a entrada J=1,K=1 <em>togla</em> (inverte) o estado, útil em contadores:</p>
      <CodeBlock language="text" title="Flip-flop JK" code={`
J  K | Q(t+1) | Ação
0  0 |  Q(t)  | Mantém (Hold)
0  1 |   0    | Reset
1  0 |   1    | Set
1  1 |  Q̄(t) | Toggle (inverte)
      `} />

      <h2>Registradores</h2>
      <p>
        Um registrador é um banco de n flip-flops que armazena uma palavra de n bits. É a unidade de armazenamento básica dentro da CPU:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Registrador paralelo", desc: "Todos os bits são carregados/lidos simultaneamente. Usado para armazenar dados temporários na CPU." },
          { name: "Registrador de deslocamento", desc: "Bits se movem um a um a cada clock. Útil para conversão serial/paralela e operações de deslocamento." },
          { name: "Registrador com Enable", desc: "Um sinal de controle determina quando o registrador aceita novos dados — evita sobrescrever valores importantes." },
          { name: "Banco de registradores", desc: "Array de registradores com lógica de seleção (endereços). Implementa os GPRs (general-purpose registers) da CPU." },
        ].map(r => (
          <div key={r.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{r.name}</h3>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      <h2>Contadores</h2>
      <p>Contadores incrementam (ou decrementam) sequencialmente a cada clock. São essenciais para PCs, endereços de memória, e temporização:</p>
      <CodeBlock language="text" title="Contador binário de 4 bits" code={`
Clock: ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑
Q3:   0  0  0  0  0  0  0  0  1  1  1  1  1  1  1  1  0
Q2:   0  0  0  0  1  1  1  1  0  0  0  0  1  1  1  1  0
Q1:   0  0  1  1  0  0  1  1  0  0  1  1  0  0  1  1  0
Q0:   0  1  0  1  0  1  0  1  0  1  0  1  0  1  0  1  0
     =0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15  0...

Ripple counter: carry se propaga bit a bit (lento mas simples)
Synchronous:    todos os bits mudam na mesma borda de clock (rápido)
      `} />

      <h2>Máquinas de Estado Finito (FSM)</h2>
      <p>
        Uma FSM é um modelo de computação com um número finito de estados, transições entre estados baseadas em entradas, e saídas. Dois tipos principais:
      </p>
      <ul>
        <li><strong>Moore:</strong> saída depende apenas do estado atual</li>
        <li><strong>Mealy:</strong> saída depende do estado atual E das entradas</li>
      </ul>
      <CodeBlock language="text" title="FSM: detector de sequência '101'" code={`
Estados: S0 (inicial), S1 (viu '1'), S2 (viu '10'), S3 (detectado '101')

Transições (entrada → próximo estado):
  S0: entrada=0 → S0,  entrada=1 → S1
  S1: entrada=0 → S2,  entrada=1 → S1
  S2: entrada=0 → S0,  entrada=1 → S3 ← DETECTADO!
  S3: entrada=0 → S2,  entrada=1 → S1 (reinicia)

Implementação:
  2 flip-flops (para 4 estados), lógica combinacional p/ transições
      `} />

      <h2>Hazards em Circuitos Sequenciais</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Setup time violation", desc: "D muda muito próximo da borda do clock. O flip-flop pode entrar em metaestabilidade — estado que não é nem 0 nem 1 claramente." },
          { name: "Hold time violation", desc: "D muda imediatamente após a borda. Causa o mesmo problema. Muito comum em designs de alta velocidade." },
          { name: "Clock skew", desc: "Diferentes flip-flops recebem o clock em momentos ligeiramente diferentes. Pode causar falhas se o skew for maior que o hold time." },
          { name: "Metaestabilidade", desc: "Estado instável onde o flip-flop não decide 0 ou 1 dentro do período do clock. Inevitável em cruzamento de domínios de clock." },
        ].map(h => (
          <div key={h.name} className="bg-card border border-border rounded-xl p-4 border-red-500/20 bg-red-500/5">
            <h3 className="font-bold text-red-400 text-sm mb-2">{h.name}</h3>
            <p className="text-sm text-muted-foreground">{h.desc}</p>
          </div>
        ))}
      </div>

      <h2>Clock e Timing em Sistemas Reais</h2>
      <CodeBlock language="text" title="Análise de timing estático (STA)" code={`
Período máximo do clock = tcq + tlogic + tsu + tskew

Onde:
  tcq    = atraso clock-to-output do flip-flop fonte (~0.1 ns)
  tlogic = atraso máximo do caminho combinacional entre flip-flops
  tsu    = setup time do flip-flop destino (~0.05 ns)
  tskew  = diferença de chegada do clock entre os dois flip-flops

Exemplo: se tlogic = 0.5 ns → período mínimo ≈ 0.65 ns
         Frequência máxima ≈ 1.5 GHz

CPUs modernas usam ferramentas EDA para análise automática
de MILHÕES de caminhos críticos simultaneamente.
      `} />

      <AlertBox type="success" title="Resumo da hierarquia de memória em circuitos">
        Flip-flop (1 bit) → Registrador (n bits) → Banco de registradores → SRAM (cache) → DRAM (RAM). Cada nível tem mais capacidade mas maior latência. Os circuitos sequenciais que você aprendeu aqui são os tijolos de toda essa hierarquia.
      </AlertBox>
    </PageContainer>
  );
}
