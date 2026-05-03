import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ComputacaoQuantica() {
  return (
    <PageContainer
      title="Computação Quântica"
      subtitle="Qubits, superposição e entrelaçamento — como o hardware quântico funciona e o que ele pode (e não pode) resolver."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Qubit"}</strong> {' — '} {"unidade quântica — pode ser 0, 1 ou superposição."}
          </li>
        <li>
            <strong>{"Superposição"}</strong> {' — '} {"qubit em múltiplos estados simultaneamente."}
          </li>
        <li>
            <strong>{"Emaranhamento"}</strong> {' — '} {"qubits correlacionados a distância."}
          </li>
        <li>
            <strong>{"Algoritmos"}</strong> {' — '} {"Shor (fatoração), Grover (busca) prometem aceleração."}
          </li>
        <li>
            <strong>{"Estado da arte"}</strong> {' — '} {"dezenas/centenas de qubits úteis; longe de uso geral."}
          </li>
        </ul>
        <h2>Classical vs Quantum</h2>
      <p>
        Computadores clássicos operam com bits (0 ou 1). Computadores quânticos usam <strong>qubits</strong>, que exploram princípios da mecânica quântica para processar informação de formas que seriam impossíveis classicamente.
      </p>

      <h2>Propriedades Fundamentais</h2>
      <div className="not-prose grid grid-cols-1 gap-4 my-8">
        {[
          {
            name: "Superposição",
            desc: "Um qubit pode estar em |0⟩, |1⟩, ou numa combinação linear de ambos simultaneamente: |ψ⟩ = α|0⟩ + β|1⟩, onde |α|² + |β|² = 1.",
            analogy: "Como uma moeda girando — não é cara nem coroa, é ambas ao mesmo tempo. Ao medir, colapsa para um estado definido.",
            color: "border-cyan-500/30 bg-cyan-500/5",
          },
          {
            name: "Entrelaçamento (Entanglement)",
            desc: "Dois qubits entrelaçados formam um sistema unificado — medir um instantaneamente determina o estado do outro, independentemente da distância.",
            analogy: "Einstein chamou de 'ação fantasmagórica à distância'. Chave para protocolos de comunicação quântica e alguns algoritmos.",
            color: "border-purple-500/30 bg-purple-500/5",
          },
          {
            name: "Interferência Quântica",
            desc: "Amplitudes de probabilidade (números complexos) podem se somar construtivamente ou se cancelar destrutivamente, como ondas.",
            analogy: "Algoritmos quânticos manipulam interferências para amplificar caminhos que levam à resposta correta e cancelar os incorretos.",
            color: "border-green-500/30 bg-green-500/5",
          },
        ].map(p => (
          <div key={p.name} className={`border rounded-xl p-5 ${p.color}`}>
            <h3 className="font-bold text-foreground text-lg mb-2">{p.name}</h3>
            <p className="text-sm text-foreground/80 mb-2">{p.desc}</p>
            <p className="text-xs text-muted-foreground italic">{p.analogy}</p>
          </div>
        ))}
      </div>

      <h2>Portas Quânticas</h2>
      <CodeBlock language="text" title="Portas quânticas fundamentais" code={`
Porta Hadamard (H): cria superposição
  H|0⟩ = (|0⟩ + |1⟩) / √2    (superposição igual)
  H|1⟩ = (|0⟩ - |1⟩) / √2

Porta Pauli-X: NOT quântico
  X|0⟩ = |1⟩
  X|1⟩ = |0⟩

Porta CNOT (Controlled-NOT): 2 qubits
  CNOT|00⟩ = |00⟩
  CNOT|01⟩ = |01⟩
  CNOT|10⟩ = |11⟩  ← flipa alvo se controle = 1
  CNOT|11⟩ = |10⟩

Porta T (π/8): rotação de fase
  T|0⟩ = |0⟩
  T|1⟩ = e^(iπ/4)|1⟩    (fase complexa)

{H, CNOT, T} formam um conjunto universal de portas quânticas
— qualquer algoritmo quântico pode ser expresso com estas 3 portas!
      `} />

      <h2>Algoritmos Quânticos Importantes</h2>
      <div className="not-prose space-y-4 my-6">
        {[
          {
            name: "Algoritmo de Shor (1994)",
            speedup: "Exponencial sobre clássico",
            problem: "Fatoração de inteiros grandes",
            impact: "Quebraria RSA-2048 com ~4.000 qubits lógicos. Isso tornou a criptografia pós-quântica urgente!",
            status: "Demonstrado em pequena escala. Hardware atual: poucos qubits ruidosos — Shor real ainda está longe.",
          },
          {
            name: "Algoritmo de Grover (1996)",
            speedup: "Quadrático sobre clássico",
            problem: "Busca em espaço não estruturado",
            impact: "Busca em N elementos em O(√N) operações. Enfraquece AES-256 para segurança equivalente a AES-128.",
            status: "Mais robusto a ruído. Demonstrado experimentalmente.",
          },
          {
            name: "VQE (Variational Quantum Eigensolver)",
            speedup: "Potencialmente exponencial",
            problem: "Simulação de moléculas e materiais",
            impact: "Descoberta de novos materiais para baterias, supercondutores, catalisadores. Farmacêutica.",
            status: "Algoritmo NISQ-friendly. Sendo explorado em IBM, Google, Quantinuum.",
          },
          {
            name: "QAOA (Quantum Approximate Optimization)",
            speedup: "Vantagem incerta",
            problem: "Problemas de otimização combinatória",
            impact: "Logística, finanças, design de chips.",
            status: "Pesquisa ativa. Vantagem clara sobre clássico ainda não demonstrada em escala.",
          },
        ].map(a => (
          <div key={a.name} className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className="font-bold text-primary">{a.name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{a.speedup}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1"><strong className="text-foreground">Problema:</strong> {a.problem}</p>
            <p className="text-sm text-foreground/80 mb-2">{a.impact}</p>
            <p className="text-xs text-cyan-400">{a.status}</p>
          </div>
        ))}
      </div>

      <h2>Hardware Quântico: Tecnologias</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { tech: "Supercondutores (Google, IBM, Intel)", note: "Circuitos de Josephson a ~15mK (-273°C). Google: 127 qubits (Eagle), 433 (Osprey), 1.121 (Condor). IBM: Heron 133 qubits. Fidelidade ~99,5% em 2024." },
          { tech: "Íons aprisionados (IonQ, Quantinuum)", note: "Átomos carregados levitando em campos EM. Fidelidade mais alta (~99,9%). Mais lento que supercondutores. Quantinuum H2: 56 qubits." },
          { tech: "Fótons (PsiQuantum, Xanadu)", note: "Qubits fotônicos em temperatura ambiente! Difícil de criar gates determinísticos. PsiQuantum aposta em fotônica integrada Si para escalar." },
          { tech: "Spin de elétrons em silício (Intel)", note: "Compatível com CMOS! Intel Tunnel Falls: 12 qubits em silício. Pode se beneficiar de toda a infraestrutura de fabricação existente." },
        ].map(t => (
          <div key={t.tech} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{t.tech}</h3>
            <p className="text-xs text-muted-foreground">{t.note}</p>
          </div>
        ))}
      </div>

      <AlertBox type="warning" title="Quantum Hype vs Realidade">
        Computadores quânticos práticos ainda estão anos (provavelmente décadas) longe de ameaçar a criptografia atual. Qubits atuais são ruidosos (NISQ — Noisy Intermediate-Scale Quantum). Um Shor real contra RSA-2048 precisaria de ~4.000 qubits lógicos perfeitos, que exigem ~4 milhões de qubits físicos para correção de erros. Temos 1.000. Mas o progresso é real e a criptografia pós-quântica (NIST PQC) está sendo padronizada agora.
      </AlertBox>
    </PageContainer>
  );
}
