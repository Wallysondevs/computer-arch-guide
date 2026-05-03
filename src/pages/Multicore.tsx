import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Multicore() {
  return (
    <PageContainer
      title="Multicore e Multithreading"
      subtitle="Como múltiplos núcleos e threads de hardware multiplicam a capacidade de processamento."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Core"}</strong> {' — '} {"CPU completa em um chip multi-core."}
          </li>
        <li>
            <strong>{"SMP"}</strong> {' — '} {"Symmetric Multi-Processing — todos os cores iguais."}
          </li>
        <li>
            <strong>{"Hyperthreading"}</strong> {' — '} {"2 threads lógicas por core físico."}
          </li>
        <li>
            <strong>{"Coerência de cache"}</strong> {' — '} {"MESI mantém L1/L2 consistentes entre cores."}
          </li>
        <li>
            <strong>{"Amdahl"}</strong> {' — '} {"speedup limitado pela parte sequencial do programa."}
          </li>
        </ul>
        <h2>Por que Multicore?</h2>
      <p>
        Por volta de 2005, o aumento de frequência de clock encontrou uma barreira: a dissipação de calor. A lei de Dennard (transistores menores → mesma potência por área) quebrou. A solução foi dobrar o número de núcleos em vez de aumentar a frequência — cada core a uma frequência menor, consumindo menos energia.
      </p>

      <h2>Coerência de Cache em Multicore</h2>
      <p>
        Com múltiplos cores, cada um tem seu cache L1/L2 privado. O <strong>problema da coerência</strong>: se o Core 0 e o Core 1 têm cópias do mesmo bloco de memória, e o Core 0 modifica sua cópia, o Core 1 pode ver dados desatualizados:
      </p>
      <CodeBlock language="c" title="Problema de coerência (sem protocolo)" code={`
// Core 0:          // Core 1:
x = 5;             // lê x (do seu cache: valor 0, desatualizado!)
                   // BUG: vê x = 0, não x = 5
      `} />

      <h2>Protocolo MESI</h2>
      <p>
        O protocolo MESI é o mais usado para manter coerência de cache em multicore. Cada bloco de cache pode estar em um de 4 estados:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { letter: "M", state: "Modified (Dirty)", desc: "Única cópia no sistema. Foi modificada, difere da memória. Deve ser escrita de volta antes de ser compartilhada.", color: "text-red-400" },
          { letter: "E", state: "Exclusive (Clean)", desc: "Única cópia no sistema. É idêntica à memória. Pode ser modificada sem aviso aos outros cores.", color: "text-cyan-400" },
          { letter: "S", state: "Shared", desc: "Múltiplos cores têm cópia. Idêntica à memória. Antes de modificar, deve invalidar as outras cópias.", color: "text-green-400" },
          { letter: "I", state: "Invalid", desc: "Bloco inválido. Não pode ser lido ou escrito sem primeiro buscar da memória ou de outro cache.", color: "text-gray-400" },
        ].map(s => (
          <div key={s.letter} className="bg-card border border-border rounded-xl p-4 flex gap-4">
            <div className={`text-3xl font-black ${s.color} w-8 shrink-0`}>{s.letter}</div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-1">{s.state}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <CodeBlock language="text" title="Transições MESI: core 0 escreve em bloco compartilhado" code={`
Estado inicial: ambos os cores têm bloco X em estado S (Shared)

Core 0 quer escrever em X:
  1. Core 0 envia "Invalidate X" no barramento coerente
  2. Core 1 recebe o invalidate, muda seu estado X para I (Invalid)
  3. Core 0 muda X para M (Modified) e escreve

Core 1 quer ler X (agora no estado I):
  1. Core 1 envia "Read X"
  2. Core 0 (tem M) detecta o Read, escreve X para memória (write-back)
  3. Ambos ficam com X em estado S
  4. Core 1 lê da memória (agora atualizado)

Custo: Invalidações causam "cache thrashing" se cores disputam o mesmo dado!
       Isso é chamado de FALSE SHARING.
      `} />

      <h2>False Sharing</h2>
      <CodeBlock language="c" title="False sharing — bug de performance em multicore" code={`
// Dois contadores em struct — parecem independentes:
struct counters {
    long count_a;  // offset 0
    long count_b;  // offset 8
} c;

// Thread 0: c.count_a++ (endereço 0x1000)
// Thread 1: c.count_b++ (endereço 0x1008)
// Mesmo bloco de cache de 64 bytes!
// Resultado: MESI invalida o bloco inteiro a cada escrita → LENTO!

// Solução: padding para separar em cache lines diferentes:
struct counters_fixed {
    long count_a;
    char _pad[56];  // preenche até 64 bytes
    long count_b;
};
// Agora cada counter está em sua própria cache line ✓
      `} />

      <h2>SMT — Simultaneous Multithreading (Hyper-Threading)</h2>
      <p>
        SMT permite que um único core físico execute dois ou mais threads de hardware simultaneamente, compartilhando as unidades de execução:
      </p>
      <CodeBlock language="text" title="SMT: como 1 core físico vira 2 lógicos" code={`
Core físico com 12 portas de execução:
                Thread A    Thread B
  Ciclo 1:     [ALU] [FPU] [  ]   [ALU] [  ] [Load]
  Ciclo 2:     [Load] [ ]  [ ]   [ALU] [MUL] [  ]
  
Um thread em cache miss → portas ficam livres
→ Outro thread usa as portas ociosas!

Ganho típico de SMT:
  Workloads de servidor (muitos threads): +20-30%
  Jogos (poucos threads): -0 a +5% (overhead de compartilhar cache)
  
Intel chama de "Hyper-Threading" (HT)
AMD chama de "Simultaneous Multithreading" (SMT)
Apple M1/M2/M3: SEM SMT (foco em IPC puro por core)
      `} />

      <h2>Lei de Amdahl</h2>
      <CodeBlock language="text" title="Lei de Amdahl — limite do paralelismo" code={`
Speedup = 1 / ((1-P) + P/N)

Onde:
  P = fração do programa paralelizável (0 a 1)
  N = número de processadores

Exemplo: P=0,9 (90% paralelizável), N=∞ (cores infinitos):
  Speedup máximo = 1 / (1-0,9) = 10×

  Com 10 cores: 1 / (0,1 + 0,9/10) = 5,3×
  Com 100 cores: 1 / (0,1 + 0,9/100) = 9,2×
  Com ∞ cores:  1 / 0,1 = 10×         ← limite!

Conclusão: os 10% sequenciais limitam o speedup máximo a 10×,
não importa quantos cores você adicione!
O gargalo é sempre a parte não paralelizável.
      `} />

      <AlertBox type="warning" title="Sincronização é difícil">
        Programação multicore exige cuidado com condições de corrida (race conditions), deadlocks e livelocks. Primitivas de sincronização como mutexes, semáforos e operações atômicas adicionam overhead. Lock-free programming com atomics é mais eficiente mas muito mais difícil de acertar.
      </AlertBox>
    </PageContainer>
  );
}
