import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TendenciasFuturo() {
  return (
    <PageContainer
      title="Tendências e o Futuro"
      subtitle="Para onde vai a arquitetura de computadores — do fim da Lei de Moore ao fim da era Von Neumann."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <h2>O Fim da Lei de Moore?</h2>
      <p>
        Gordon Moore observou em 1965 que o número de transistores em um chip dobrava a cada ~2 anos. Por décadas, isso foi uma realidade. Mas as leis da física estão impondo limites:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { challenge: "Limite físico dos transistores", desc: "Gate de 3nm é menos de 10 átomos de silício. Em 2nm (Intel/Samsung A2) e 1,4nm (TSMC A14, 2027), efeitos quânticos como tunelamento tornam transistores inerentemente vazantes." },
          { challenge: "Dissipação de calor (Power Wall)", desc: "Transistores menores dissipam mais calor por área. CPUs modernas já dissipam 300+ W. Resfriamento a líquido tornou-se mainstream em servidores." },
          { challenge: "Custo de fabricação", desc: "Fab de última geração (3nm) custa $20B+. Apenas TSMC, Samsung e Intel Foundry podem fabricá-los. A cadeia de supply é extremamente concentrada." },
          { challenge: "Memory Wall", desc: "CPUs ficam mais rápidas mais rapidamente que a memória. A lacuna de performance CPU-DRAM cresce. HBM e CXL são respostas parciais." },
        ].map(c => (
          <div key={c.challenge} className="bg-card border border-red-500/20 rounded-xl p-4">
            <h3 className="font-bold text-red-400 text-sm mb-2">{c.challenge}</h3>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2>Tendências Arquiteturais</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            trend: "Chiplets e Integração 3D",
            timeframe: "Agora (2024-2028)",
            color: "border-cyan-500/30 bg-cyan-500/5",
            desc: "Em vez de um único die gigante (baixo yield), múltiplos chiplets menores são interconectados em um pacote. AMD EPYC usa até 13 chiplets por socket. TSMC CoWoS e SoIC empilham silício 3D. Intel Foveros 3D. Próximo passo: memória SRAM empilhada sobre CPU (AMD 3D V-Cache, IMEC).",
          },
          {
            trend: "Especialização e Domain-Specific Architectures",
            timeframe: "Agora e próximos 10 anos",
            color: "border-purple-500/30 bg-purple-500/5",
            desc: "Aceleradores especializados (NPU, TPU, FPGA, ASICs de IA) superam CPUs de propósito geral em eficiência 10-1000×. A visão: SoCs com dezenas de aceleradores dedicados + CPU pequena orquestrando tudo. Patterson & Hennessy (Turing Award 2017) chamam isso de 'The Golden Age of Computer Architecture'.",
          },
          {
            trend: "Computação Near-Memory e In-Memory",
            timeframe: "2025-2030",
            color: "border-green-500/30 bg-green-500/5",
            desc: "Mover a computação para perto (ou dentro) da memória elimina o memory wall. Processing-in-Memory (PIM) em DDR/HBM: lógica simples dentro dos chips de DRAM. CXL 3.0 permite memória coerente expansível. Samsung HBM-PIM, UPMEM PIM.",
          },
          {
            trend: "Photonic Computing",
            timeframe: "2028-2035",
            color: "border-yellow-500/30 bg-yellow-500/5",
            desc: "Usar fótons (luz) em vez de elétrons para computar e comunicar. Vantagens: velocidade da luz, sem resistência (sem calor por propagação), multiplexação de comprimentos de onda. Lightmatter, Luminous, EPFL pesquisam PICs (Photonic Integrated Circuits) para redes neurais.",
          },
          {
            trend: "Computação Neuromórfica",
            timeframe: "2026-2035",
            color: "border-orange-500/30 bg-orange-500/5",
            desc: "Hardware que imita neurônios biológicos com disparos de spike: Intel Loihi 2, IBM TrueNorth. Ultra-eficiente energeticamente (mW vs kW de GPU). Ideal para reconhecimento de padrões temporais. Ainda longe de aplicações mainstream.",
          },
          {
            trend: "RISC-V e Open Hardware",
            timeframe: "Agora e crescente",
            color: "border-indigo-500/30 bg-indigo-500/5",
            desc: "RISC-V está democratizando hardware assim como Linux democratizou software. Open-source cores (CVA6, Rocket, BOOM), toolchains (GCC/LLVM), simuladores (Spike, QEMU). China, India e Europa investem em RISC-V para soberania tecnológica.",
          },
          {
            trend: "Computação Quântica + Clássica (Híbrida)",
            timeframe: "2028-2040",
            color: "border-pink-500/30 bg-pink-500/5",
            desc: "QPUs (Quantum Processing Units) não substituem CPUs — trabalharão juntos. CPUs gerenciam interface, pré e pós-processamento; QPUs resolvem subproblemas onde têm vantagem quântica (simulação molecular, otimização). Quantum cloud: IBM, Google, Amazon Braket já oferecem QPU-as-a-service.",
          },
        ].map(t => (
          <div key={t.trend} className={`border rounded-xl p-5 ${t.color}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-foreground text-base">{t.trend}</h3>
              <span className="text-xs bg-black/30 text-muted-foreground px-2 py-0.5 rounded-full font-mono">{t.timeframe}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      <h2>O Novo Paradigma: Abundance of Parallelism</h2>
      <p>
        O futuro não é um processador mais rápido — é <em>mais processadores</em> fazendo coisas diferentes ao mesmo tempo. A arquitetura do futuro é heterogênea:
      </p>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {[
          { unit: "CPU", role: "Orquestração, código sequencial complexo" },
          { unit: "GPU", role: "Computação massivamente paralela, IA, gráficos" },
          { unit: "NPU", role: "Inferência neural ultra-eficiente on-device" },
          { unit: "FPGA", role: "Hardware reconfigurável para latência extrema" },
          { unit: "ISP", role: "Processamento de câmera em tempo real" },
          { unit: "DSP", role: "Áudio, sinais, codecs" },
          { unit: "Security", role: "Enclave seguro, criptografia, biometria" },
          { unit: "QPU", role: "Algoritmos quânticos (futuro)" },
        ].map(u => (
          <div key={u.unit} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-lg font-black text-primary mb-1">{u.unit}</div>
            <p className="text-xs text-muted-foreground leading-tight">{u.role}</p>
          </div>
        ))}
      </div>

      <AlertBox type="success" title="Parabéns por completar o guia!">
        Você percorreu 35 tópicos — do transistor ao qubit, dos flip-flops ao machine learning. Arquitetura de computadores é uma das áreas mais ricas da ciência da computação, fundamento de tudo que construímos no mundo digital. Continue explorando: microarquitetura, compiladores, sistemas operacionais, e design de chips são caminhos naturais.
      </AlertBox>

      <h2>Recursos para Continuar Aprendendo</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { cat: "Livros", items: ["Computer Organization and Design (Patterson & Hennessy) — RISC-V Edition", "Computer Architecture: A Quantitative Approach (Hennessy & Patterson)", "Modern Processor Design (Shen & Lipasti)"] },
          { cat: "Cursos Online", items: ["MIT 6.004 Computation Structures (OpenCourseWare, gratuito)", "Carnegie Mellon 15-213 / CS:APP (gratuito)", "Nand2Tetris (do NAND ao SO, gratuito)"] },
          { cat: "Sites e Blogs", items: ["Chips & Cheese (análises de microarquitetura)", "AnandTech (análises de hardware detalhadas)", "Real World Tech (David Kanter)", "WikiChip (banco de dados de chips)"] },
          { cat: "Simuladores", items: ["RISC-V Playground (browser)", "RIPES (pipeline visualizador RISC-V)", "GEM5 (simulador de microarquitetura)", "QEMU (emulador completo de arquiteturas)"] },
        ].map(r => (
          <div key={r.cat} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-2">{r.cat}</h3>
            <ul className="space-y-1">
              {r.items.map(i => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary">›</span> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
