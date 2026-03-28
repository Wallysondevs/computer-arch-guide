import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AlgebraBooleana() {
  return (
    <PageContainer
      title="Álgebra Booleana e Portas Lógicas"
      subtitle="A matemática que rege os circuitos digitais — de transistores a CPUs inteiras."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <h2>O que é Álgebra Booleana?</h2>
      <p>
        Desenvolvida por George Boole em 1854, a álgebra booleana trabalha apenas com dois valores: verdadeiro (1) e falso (0). É a fundação matemática de todos os circuitos digitais.
      </p>
      <p>
        Claude Shannon, em 1937, percebeu que a álgebra booleana podia descrever circuitos elétricos com relés — estabelecendo a ponte entre matemática e engenharia de hardware.
      </p>

      <h2>Operações Fundamentais</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        {[
          {
            op: "AND (E)",
            symbol: "A · B ou A ∧ B",
            desc: "Saída 1 somente se AMBAS as entradas forem 1",
            table: [["0","0","0"],["0","1","0"],["1","0","0"],["1","1","1"]],
            color: "text-cyan-400",
          },
          {
            op: "OR (OU)",
            symbol: "A + B ou A ∨ B",
            desc: "Saída 1 se PELO MENOS UMA entrada for 1",
            table: [["0","0","0"],["0","1","1"],["1","0","1"],["1","1","1"]],
            color: "text-green-400",
          },
          {
            op: "NOT (NÃO)",
            symbol: "Ā ou ¬A",
            desc: "Inverte a entrada: 0→1, 1→0",
            table: [["0","—","1"],["1","—","0"]],
            color: "text-yellow-400",
          },
        ].map(op => (
          <div key={op.op} className="bg-card border border-border rounded-xl p-5">
            <h3 className={`font-bold text-base mb-1 ${op.color}`}>{op.op}</h3>
            <p className="font-mono text-xs text-muted-foreground mb-2">{op.symbol}</p>
            <p className="text-sm text-muted-foreground mb-3">{op.desc}</p>
            <table className="w-full text-xs text-center font-mono border-collapse">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="border border-border px-2 py-1">A</th>
                  <th className="border border-border px-2 py-1">B</th>
                  <th className={`border border-border px-2 py-1 ${op.color}`}>Saída</th>
                </tr>
              </thead>
              <tbody>
                {op.table.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-border px-2 py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <h2>Portas Derivadas</h2>
      <p>
        Combinando as três operações básicas, obtemos portas muito úteis:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "NAND", formula: "Ā·B̄ = NOT(AND)", desc: "Universal: qualquer circuito pode ser feito só com NANDs", color: "border-purple-500/30 bg-purple-500/5" },
          { name: "NOR", formula: "Ā+B̄ = NOT(OR)", desc: "Também universal. Usado em PLAs mais antigas", color: "border-orange-500/30 bg-orange-500/5" },
          { name: "XOR", formula: "A⊕B = A·B̄ + Ā·B", desc: "Saída 1 quando entradas são DIFERENTES. Essencial em somadores", color: "border-cyan-500/30 bg-cyan-500/5" },
          { name: "XNOR", formula: "NOT(A⊕B)", desc: "Saída 1 quando entradas são IGUAIS. Útil em comparadores", color: "border-green-500/30 bg-green-500/5" },
        ].map(g => (
          <div key={g.name} className={`border rounded-xl p-4 ${g.color}`}>
            <h3 className="font-bold text-foreground mb-1">{g.name}</h3>
            <p className="font-mono text-xs text-primary mb-2">{g.formula}</p>
            <p className="text-sm text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </div>

      <h2>Leis da Álgebra Booleana</h2>
      <CodeBlock language="text" title="Principais leis e identidades" code={`
Identidade:        A · 1 = A       A + 0 = A
Nulidade:          A · 0 = 0       A + 1 = 1
Idempotência:      A · A = A       A + A = A
Complemento:       A · Ā = 0       A + Ā = 1
Dupla negação:     NOT(NOT(A)) = A

Comutatividade:    A · B = B · A   A + B = B + A
Associatividade:   (A·B)·C = A·(B·C)
Distributividade:  A·(B+C) = A·B + A·C

Teoremas de De Morgan:
  NOT(A · B) = NOT(A) + NOT(B)   ← NAND = NOR dos negados
  NOT(A + B) = NOT(A) · NOT(B)   ← NOR  = AND dos negados
      `} />

      <h2>Simplificação com Mapas de Karnaugh (K-map)</h2>
      <p>
        Mapas de Karnaugh são uma técnica visual para minimizar expressões booleanas, encontrando a forma mais simples de um circuito.
      </p>
      <CodeBlock language="text" title="K-map para 2 variáveis" code={`
Função: F(A,B) = A·B̄ + A·B = A

      | B=0 | B=1 |
A=0   |  0  |  0  |
A=1   |  1  |  1  |   ← agrupa os dois 1s → F = A

Função: F(A,B) = A·B̄ + Ā·B (XOR)

      | B=0 | B=1 |
A=0   |  0  |  1  |
A=1   |  1  |  0  |   → Não pode ser simplificada além de A⊕B
      `} />

      <h2>Portas na Prática: CMOS</h2>
      <p>
        Circuitos integrados modernos usam tecnologia <strong>CMOS</strong> (Complementary Metal-Oxide-Semiconductor). Cada porta lógica é implementada com um par de transistores complementares:
      </p>
      <ul>
        <li><strong>NMOS</strong> (canal N): conduz quando a entrada é alta (1)</li>
        <li><strong>PMOS</strong> (canal P): conduz quando a entrada é baixa (0)</li>
      </ul>
      <p>
        A beleza do CMOS é que, no estado estático, um dos transistores está sempre bloqueado — não há caminho direto entre VDD e GND, economizando energia. Por isso CPUs modernas usam CMOS.
      </p>

      <AlertBox type="info" title="NAND é a porta mais comum">
        Na prática, a maioria dos chips usa internamente portas NAND, pois são as mais compactas e rápidas em CMOS. Compiladores de hardware (síntese) automaticamente convertem qualquer expressão lógica em redes de NANDs/NORs otimizadas.
      </AlertBox>

      <h2>Fan-in, Fan-out e Propagation Delay</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { term: "Fan-in", def: "Número máximo de entradas que uma porta pode ter. Portas com fan-in alto são mais lentas e maiores." },
          { term: "Fan-out", def: "Número de portas que a saída pode alimentar. Exceder o fan-out causa degradação do sinal." },
          { term: "Propagation Delay", def: "Tempo que o sinal leva para percorrer uma porta. Determina a frequência máxima do clock do circuito." },
        ].map(item => (
          <div key={item.term} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{item.term}</h3>
            <p className="text-sm text-muted-foreground">{item.def}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
