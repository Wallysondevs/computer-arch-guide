import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NUMA() {
  return (
    <PageContainer
      title="NUMA e Sistemas Distribuídos"
      subtitle="Non-Uniform Memory Access — como servidores de múltiplos soquetes gerenciam a memória de forma assimétrica."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"NUMA"}</strong> {' — '} {"Non-Uniform Memory Access — cada CPU tem RAM mais próxima."}
          </li>
        <li>
            <strong>{"Local vs remoto"}</strong> {' — '} {"acesso local mais rápido que remoto."}
          </li>
        <li>
            <strong>{"Affinity"}</strong> {' — '} {"threads atadas a nós NUMA específicos."}
          </li>
        <li>
            <strong>{"Servidores"}</strong> {' — '} {"padrão em multi-socket Xeon/EPYC."}
          </li>
        <li>
            <strong>{"NUMA-aware"}</strong> {' — '} {"SO e DB modernos otimizam para isso."}
          </li>
        </ul>
        <h2>O Problema do Acesso Uniforme</h2>
      <p>
        Em sistemas com múltiplos processadores (soquetes), conectar todos os CPUs a uma única memória compartilhada cria um gargalo enorme. A solução é distribuir a memória — cada CPU tem sua própria memória local, mas pode acessar a memória dos outros CPUs através de interconexões. Isso é <strong>NUMA</strong>.
      </p>

      <h2>UMA vs NUMA</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "UMA (Uniform Memory Access)", desc: "Todos os CPUs acessam a memória com o mesmo tempo de acesso. Funciona bem para sistemas pequenos (1-2 soquetes), mas o barramento vira gargalo em sistemas maiores.", example: "Desktops consumer, laptops, sistemas de 1 socket" },
          { name: "NUMA (Non-Uniform Memory Access)", desc: "Cada CPU tem memória local (NUMA node). Acesso local: rápido. Acesso remoto (de outro nó): mais lento. A topologia define as latências.", example: "Servidores AMD EPYC, Intel Xeon, supercomputadores" },
        ].map(t => (
          <div key={t.name} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary mb-2">{t.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{t.desc}</p>
            <p className="text-xs text-muted-foreground"><strong>Exemplos:</strong> {t.example}</p>
          </div>
        ))}
      </div>

      <h2>NUMA em Servidores AMD EPYC</h2>
      <CodeBlock language="text" title="AMD EPYC Genoa (9654, 96 cores) — topologia NUMA" code={`
Sistema 2-socket:
  Socket 0: 96 cores, 384 GB DDR5
  Socket 1: 96 cores, 384 GB DDR5

Dentro de cada socket: 12 CCD (Core Chiplet Die) + 1 IOD
  Cada CCD: 8 cores, L3 de 32 MB
  IOD: controladores de memória, PCIe, interconexões

NUMA nodes em 2-socket EPYC 9654:
  Sistema reconhece 8 NUMA nodes (4 por socket, 1 por CCD cluster)

Latências típicas:
  Acesso local L3 (mesmo CCD):        ~40 ns
  Acesso dentro do socket (outro CCD): ~80-120 ns
  Acesso remoto (outro socket via IF):  ~150-200 ns

Interconexão: AMD Infinity Fabric (IF)
  Largura de banda inter-socket: ~100 GB/s
      `} />

      <h2>Impacto na Performance</h2>
      <CodeBlock language="bash" title="Verificando NUMA no Linux" code={`
# Ver topologia NUMA:
numactl --hardware

# Saída típica 2-socket:
# available: 2 nodes (0-1)
# node 0 cpus: 0-47 96-143
# node 0 size: 192 GB
# node 1 cpus: 48-95 144-191
# node 1 size: 192 GB
# node distances:
# node   0    1
#   0:  10   21    ← acesso local 10, remoto 21 (2.1× mais lento)
#   1:  21   10

# Executar processo no NUMA node 0, com memória local:
numactl --cpunodebind=0 --membind=0 ./meu_programa

# Verificar alocações NUMA de um processo em execução:
numastat -p $(pgrep postgres)
      `} />

      <h2>Estratégias de Programação NUMA-Aware</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { strat: "Thread Pinning", desc: "Vincular threads a cores específicos (taskset, pthread_setaffinity_np) para evitar migração entre nós NUMA.", cmd: "taskset -c 0-47 ./servidor" },
          { strat: "Alocação local de memória", desc: "Alocar memória no nó NUMA do thread que vai usá-la. Usar numa_alloc_local() ou mmap com numactl.", cmd: "numactl --localalloc ./programa" },
          { strat: "Particionamento de dados", desc: "Dividir dataset em partições: cada socket processa sua partição em sua memória local. Comunicação mínima entre sockets.", cmd: "—" },
          { strat: "NUMA-aware allocators", desc: "jemalloc e tcmalloc têm suporte NUMA. Postgres, MySQL têm código NUMA-aware para alocação de shared_buffers.", cmd: "—" },
        ].map(s => (
          <div key={s.strat} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{s.strat}</h3>
            <p className="text-xs text-muted-foreground mb-2">{s.desc}</p>
            {s.cmd !== "—" && <code className="text-xs font-mono text-green-400 bg-black/30 px-2 py-1 rounded">{s.cmd}</code>}
          </div>
        ))}
      </div>

      <h2>Interconexões de Alta Performance</h2>
      <div className="not-prose space-y-3 my-6">
        {[
          { name: "AMD Infinity Fabric (IF)", bw: "~100 GB/s", use: "Interconexão entre CCDs no mesmo socket e entre sockets. Base de todos os EPYC." },
          { name: "Intel UPI (Ultra Path Interconnect)", bw: "~41 GB/s por link (×3 links/socket)", use: "Xeon Scalable: até 2-4 sockets por sistema." },
          { name: "NVLink 4 (NVIDIA)", bw: "900 GB/s (bidirecion.)", use: "GPU-GPU e GPU-CPU (NVLink-C2C no Grace Hopper). Supercomputadores de IA." },
          { name: "CXL 3.0 (Compute Express Link)", bw: "PCIe 5.0 (128 GB/s ×16)", use: "Memória coerente expansível. Adicionar RAM ou accelerators coerentes via PCIe." },
          { name: "InfiniBand HDR/NDR", bw: "200/400 Gbps por porta", use: "HPC clusters: MPI messaging de baixa latência entre nós de supercomputadores." },
        ].map(i => (
          <div key={i.name} className="bg-card border border-border rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-primary text-sm">{i.name}</h3>
              <span className="text-xs font-mono text-muted-foreground">{i.bw}</span>
            </div>
            <p className="text-xs text-muted-foreground">{i.use}</p>
          </div>
        ))}
      </div>

      <AlertBox type="info" title="NUMA e bancos de dados">
        Bancos de dados como PostgreSQL, Oracle e SQL Server têm configurações específicas para NUMA. No PostgreSQL, `numa_awareness` e o placement de shared_buffers são críticos em servidores multi-socket. Ignorar NUMA pode deixar 30-50% de performance na mesa.
      </AlertBox>
    </PageContainer>
  );
}
