<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToSignup = () => router.push('/signup')
const goToLogin = () => router.push('/login')

const mobileMenuOpen = ref(false)

const faqs = [
  {
    question: 'O Zapgrana e seguro? Meus dados do WhatsApp sao privados?',
    answer: 'Sim! Utilizamos criptografia de ponta a ponta e seguimos todas as normas da LGPD. Seus dados financeiros nunca sao compartilhados e voce pode excluir seu historico a qualquer momento.',
    open: true
  },
  {
    question: 'Preciso baixar algum aplicativo?',
    answer: 'Nao. O Zapgrana funciona 100% dentro do WhatsApp. Basta adicionar o nosso numero e comecar a conversar com o Doutor Equilibrio.',
    open: false
  },
  {
    question: 'Como funciona o cancelamento do Plano Pro?',
    answer: 'Voce pode cancelar a qualquer momento sem taxas ocultas. Basta enviar a palavra "CANCELAR" para o bot ou gerenciar sua assinatura pelo painel do usuario.',
    open: false
  }
]

const toggleFaq = (index: number) => {
  faqs[index].open = !faqs[index].open
}
</script>

<template>
  <div class="bg-surface text-on-surface font-sans">
    <!-- Header -->
    <header class="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div class="flex justify-between items-center h-20 px-4 md:px-6 max-w-[1280px] mx-auto">
        <img src="/images/logo.png" alt="Zapgrana Logo" class="h-auto w-[140px] object-contain">

        <nav class="hidden md:flex gap-8">
          <a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#beneficios">Beneficios</a>
          <a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#como-funciona">Como Funciona</a>
          <a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#precos">Precos</a>
        </nav>

        <button
          @click="goToLogin"
          class="hidden md:block bg-zapgrana-green text-on-primary px-6 py-2.5 rounded-full font-bold active:scale-95 duration-200 transition-all hover:bg-opacity-90"
        >
          Entrar
        </button>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2">
          <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden px-4 pb-4 border-t border-outline-variant/30">
        <nav class="flex flex-col gap-4 py-4">
          <a class="text-on-surface-variant" href="#beneficios" @click="mobileMenuOpen = false">Beneficios</a>
          <a class="text-on-surface-variant" href="#como-funciona" @click="mobileMenuOpen = false">Como Funciona</a>
          <a class="text-on-surface-variant" href="#precos" @click="mobileMenuOpen = false">Precos</a>
        </nav>
        <button @click="goToLogin" class="w-full bg-zapgrana-green text-on-primary py-2.5 rounded-full font-bold">
          Entrar
        </button>
      </div>
    </header>

    <main class="pt-20">
      <!-- Hero Section -->
      <section class="hero-gradient pt-16 pb-24 px-4 md:px-6 overflow-hidden">
        <div class="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-12">
          <div class="md:w-1/2">
            <h1 class="text-[40px] md:text-[64px] font-bold leading-[1.1] tracking-tight text-on-background mb-6">
              Seu dinheiro sob controle. No WhatsApp. <span class="text-zapgrana-green">Com IA.</span>
            </h1>
            <p class="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
              A gestao financeira mais simples do mundo. Sem apps complexos, sem planilhas chatas. Apenas mande um Zap e deixe o Doutor Equilibrio cuidar de tudo.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="goToSignup"
                class="bg-zapgrana-green text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Comecar gratis
                <span class="material-symbols-outlined">arrow_forward</span>
              </button>
              <div class="flex items-center gap-2 px-4 text-on-surface-variant">
                <span class="material-symbols-outlined text-whatsapp-green" style="font-variation-settings: 'FILL' 1;">verified</span>
                <span class="text-sm font-medium">Integrado ao WhatsApp</span>
              </div>
            </div>
          </div>

          <div class="md:w-1/2 relative">
            <div class="relative z-10 rounded-[40px] overflow-hidden border-[8px] border-on-surface-variant shadow-2xl bg-white max-w-[340px] mx-auto">
              <img
                alt="Doutor Equilibrio"
                class="w-full h-auto"
                src="/images/dr-equilibrio.jpg"
              >
              <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-2xl shadow-lg border border-outline-variant/30">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-8 h-8 rounded-full bg-zapgrana-green flex items-center justify-center text-white">
                    <span class="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                  <span class="font-bold text-sm">Doutor Equilibrio</span>
                </div>
                <p class="text-xs text-on-surface-variant">"Gasto de R$ 45,00 em 'Almoco' registrado. Voce ainda tem R$ 320,00 para lazer este mes."</p>
              </div>
            </div>
            <!-- Decorative element -->
            <div class="absolute -top-10 -right-10 w-64 h-64 bg-growth-light/30 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      <!-- Social Proof Bar -->
      <section class="bg-white py-12 border-y border-outline-variant/20">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6 flex flex-wrap justify-center md:justify-around gap-8 text-center">
          <div>
            <div class="text-[32px] font-bold text-zapgrana-green">+38.000</div>
            <div class="text-sm font-medium text-on-surface-variant">Usuarios Ativos</div>
          </div>
          <div>
            <div class="text-[32px] font-bold text-zapgrana-green">R$ 15M+</div>
            <div class="text-sm font-medium text-on-surface-variant">Gastos Gerenciados</div>
          </div>
          <div>
            <div class="text-[32px] font-bold text-zapgrana-green">4.9/5</div>
            <div class="flex justify-center text-amber-500 my-1">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
            </div>
            <div class="text-sm font-medium text-on-surface-variant">Avaliacao na App Store</div>
          </div>
        </div>
      </section>

      <!-- Como Funciona Section -->
      <section class="py-24 px-4 md:px-6 max-w-[1280px] mx-auto" id="como-funciona">
        <div class="text-center mb-16">
          <span class="bg-zapgrana-green/10 text-zapgrana-green px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">Passo a passo</span>
          <h2 class="text-[40px] font-bold mt-4">Simples como enviar um audio</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-12">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-zapgrana-green mb-6 shadow-sm">
              <span class="material-symbols-outlined text-4xl">add_comment</span>
            </div>
            <h3 class="text-2xl font-semibold mb-3">1. Mande uma mensagem</h3>
            <p class="text-on-surface-variant">Gastou no cafe? Mandou audio, foto do comprovante ou texto: "Cafe R$ 10".</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-zapgrana-green mb-6 shadow-sm">
              <span class="material-symbols-outlined text-4xl">auto_awesome</span>
            </div>
            <h3 class="text-2xl font-semibold mb-3">2. IA Categoriza</h3>
            <p class="text-on-surface-variant">Nossa inteligencia entende o gasto, categoriza e atualiza seu orcamento instantaneamente.</p>
          </div>

          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-zapgrana-green mb-6 shadow-sm">
              <span class="material-symbols-outlined text-4xl">query_stats</span>
            </div>
            <h3 class="text-2xl font-semibold mb-3">3. Receba Insights</h3>
            <p class="text-on-surface-variant">Acompanhe limites mensais e receba conselhos do Doutor Equilibrio para economizar.</p>
          </div>
        </div>
      </section>

      <!-- Funcionalidades Grid (Bento Style) -->
      <section class="py-24 bg-surface-container-low/50" id="beneficios">
        <div class="max-w-[1280px] mx-auto px-4 md:px-6">
          <div class="text-center mb-16">
            <h2 class="text-[40px] font-bold">Tudo que voce precisa</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Audio - Large Card -->
            <div class="md:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center">
              <div class="flex-1">
                <span class="material-symbols-outlined text-zapgrana-green mb-4 text-4xl">mic</span>
                <h3 class="text-2xl font-semibold mb-2">Entrada por Audio</h3>
                <p class="text-on-surface-variant">Nao quer digitar? Mande um audio de 2 segundos. Nossa IA transcreve e registra o valor e o local do gasto automaticamente.</p>
              </div>
              <div class="flex-1 w-full bg-surface-container rounded-2xl p-6">
                <div class="bg-white p-3 rounded-xl mb-3 shadow-sm border border-outline-variant/20 flex items-center gap-3">
                  <span class="material-symbols-outlined text-whatsapp-green">play_circle</span>
                  <div class="h-2 flex-1 bg-surface-variant rounded-full overflow-hidden">
                    <div class="h-full w-2/3 bg-whatsapp-green"></div>
                  </div>
                  <span class="text-xs font-mono">0:03</span>
                </div>
                <div class="text-xs text-on-surface-variant italic">"Acabei de pagar o almoco, deu 35 reais no cartao."</div>
              </div>
            </div>

            <!-- Relatorios -->
            <div class="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col">
              <span class="material-symbols-outlined text-zapgrana-green mb-4 text-4xl">analytics</span>
              <h3 class="text-2xl font-semibold mb-2">Relatorios</h3>
              <p class="text-on-surface-variant mb-6">Receba PDFs semanais e mensais detalhados direto no seu celular.</p>
              <div class="mt-auto pt-4 border-t border-outline-variant/20">
                <div class="flex justify-between items-center text-sm font-bold text-zapgrana-green">
                  <span>Ver Exemplo</span>
                  <span class="material-symbols-outlined">open_in_new</span>
                </div>
              </div>
            </div>

            <!-- Parcelas -->
            <div class="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30">
              <span class="material-symbols-outlined text-zapgrana-green mb-4 text-4xl">calendar_month</span>
              <h3 class="text-2xl font-semibold mb-2">Parcelas Inteligentes</h3>
              <p class="text-on-surface-variant">Lancou um gasto parcelado? O Zapgrana cuida de projetar as parcelas nos meses seguintes.</p>
            </div>

            <!-- Foto -->
            <div class="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30">
              <span class="material-symbols-outlined text-zapgrana-green mb-4 text-4xl">photo_camera</span>
              <h3 class="text-2xl font-semibold mb-2">Leitura de Notas</h3>
              <p class="text-on-surface-variant">Tire foto do cupom fiscal e deixe a IA extrair cada item da sua compra no supermercado.</p>
            </div>

            <!-- Alertas -->
            <div class="md:col-span-4 bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/30">
              <span class="material-symbols-outlined text-zapgrana-green mb-4 text-4xl">notifications_active</span>
              <h3 class="text-2xl font-semibold mb-2">Alertas de Limite</h3>
              <p class="text-on-surface-variant">Defina metas para lazer, alimentacao e moradia. Avisamos quando estiver chegando no limite.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Doutor Equilibrio Section -->
      <section class="py-24 px-4 md:px-6 max-w-[1280px] mx-auto">
        <div class="bg-primary p-8 md:p-16 rounded-[40px] text-on-primary flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-zapgrana-green rounded-full blur-[120px] -z-0 opacity-50"></div>

          <div class="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
            <img
              alt="Doutor Equilibrio Portrait"
              class="w-full h-full object-cover rounded-full border-4 border-growth-light"
              src="/images/dr-equilibrio.jpg"
            >
          </div>

          <div class="relative z-10">
            <span class="text-growth-light font-bold text-sm uppercase mb-4 block">Parceria Exclusiva</span>
            <h2 class="text-[40px] font-bold leading-tight mb-6">Mentoria Financeira com o Doutor Equilibrio</h2>
            <blockquote class="text-lg text-on-primary-container italic mb-8 leading-relaxed">
              "Minha missao e democratizar a educacao financeira. Com o Zapgrana, levamos a inteligencia que antes era restrita a bancos de investimento diretamente para a mao de qualquer brasileiro via WhatsApp."
            </blockquote>
            <p class="font-bold text-lg">Doutor Equilibrio</p>
            <p class="text-sm opacity-80">Mentor e Especialista em Financas Pessoais</p>
          </div>
        </div>
      </section>

      <!-- Precos Section -->
      <section class="py-24 px-4 md:px-6 max-w-[1280px] mx-auto" id="precos">
        <div class="text-center mb-16">
          <h2 class="text-[40px] font-bold">O plano ideal para seu bolso</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Plano Gratis -->
          <div class="bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col">
            <h3 class="text-2xl font-semibold mb-2">Basico</h3>
            <p class="text-on-surface-variant text-sm mb-6">Para quem esta comecando a se organizar.</p>
            <div class="mb-8">
              <span class="text-4xl font-bold">R$ 0</span>
              <span class="text-on-surface-variant">/mes</span>
            </div>
            <ul class="space-y-4 mb-10 flex-1">
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>7 dias gratis</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Categorizacao automatica</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Relatorio mensal simples</span>
              </li>
            </ul>
            <button
              @click="goToSignup"
              class="w-full py-3 rounded-xl border-2 border-zapgrana-green text-zapgrana-green font-bold hover:bg-surface-container-low transition-colors"
            >
              Comecar Agora
            </button>
          </div>

          <!-- Plano Pro -->
          <div class="bg-white p-8 rounded-3xl border-2 border-zapgrana-green shadow-xl relative flex flex-col">
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-zapgrana-green text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase">Mais Popular</div>
            <h3 class="text-2xl font-semibold mb-2">Pro</h3>
            <p class="text-on-surface-variant text-sm mb-6">Para quem busca liberdade financeira total.</p>
            <div class="mb-8">
              <span class="text-4xl font-bold">R$ 29,90</span>
              <span class="text-on-surface-variant">/mes</span>
            </div>
            <ul class="space-y-4 mb-10 flex-1">
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span class="font-bold">Registros ilimitados</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Entrada por audio e foto</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Gestao de parcelamentos</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="material-symbols-outlined text-zapgrana-green" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Conselhos da IA personalizados</span>
              </li>
            </ul>
            <button
              @click="goToSignup"
              class="w-full py-4 rounded-xl bg-zapgrana-green text-on-primary font-bold shadow-lg shadow-zapgrana-green/20 hover:opacity-90 transition-all"
            >
              Assinar Pro
            </button>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-24 px-4 md:px-6 max-w-3xl mx-auto">
        <h2 class="text-[40px] font-bold text-center mb-12">Duvidas Frequentes</h2>

        <div class="space-y-4">
          <details
            v-for="(faq, index) in faqs"
            :key="index"
            class="group bg-white border border-outline-variant/30 rounded-2xl overflow-hidden"
            :open="faq.open"
          >
            <summary class="flex justify-between items-center p-6 cursor-pointer font-bold list-none">
              {{ faq.question }}
              <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="px-6 pb-6 text-on-surface-variant">
              {{ faq.answer }}
            </div>
          </details>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-24 px-4 md:px-6">
        <div class="max-w-[1280px] mx-auto bg-gradient-to-br from-zapgrana-green to-primary p-12 md:p-24 rounded-[40px] text-center text-on-primary">
          <h2 class="text-[40px] font-bold mb-6">Pronto para transformar sua vida financeira?</h2>
          <p class="text-lg mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Junte-se a mais de 38 mil pessoas que ja estao gastando menos e guardando mais com a ajuda do Doutor Equilibrio.
          </p>
          <button
            @click="goToSignup"
            class="bg-white text-zapgrana-green px-10 py-5 rounded-2xl font-extrabold text-xl shadow-xl hover:scale-105 transition-transform active:scale-95"
          >
            Quero comecar agora mesmo!
          </button>
          <p class="mt-6 text-sm opacity-70">Teste gratis por 7 dias no Plano Pro</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="w-full py-24 mt-auto bg-surface-container-highest border-t border-outline-variant">
      <div class="max-w-[1280px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-1">
          <img src="/images/logo.png" alt="Zapgrana Logo" class="h-auto w-[160px] object-contain">
          <p class="mt-4 text-on-surface-variant">Gestao financeira inteligente</p>
        </div>

        <div>
          <h4 class="font-bold mb-6">Plataforma</h4>
          <ul class="space-y-4">
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#como-funciona">Como Funciona</a></li>
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#precos">Planos e Precos</a></li>
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-6">Institucional</h4>
          <ul class="space-y-4">
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#">Termos de Uso</a></li>
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#">Privacidade</a></li>
            <li><a class="text-on-surface-variant hover:text-zapgrana-green transition-colors" href="#">Seguranca</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold mb-6">Acompanhe</h4>
          <div class="flex gap-4">
            <a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-zapgrana-green hover:text-white transition-all" href="#">
              <span class="material-symbols-outlined text-lg">public</span>
            </a>
            <a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-zapgrana-green hover:text-white transition-all" href="https://youtube.com/@doutor.equilibrio" target="_blank">
              <span class="material-symbols-outlined text-lg">videocam</span>
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-[1280px] mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
        <span>&copy; 2026 Zapgrana. Todos os direitos reservados.</span>
        <div class="flex gap-6">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">lock</span>
            Dados 100% Protegidos
          </span>
        </div>
      </div>
    </footer>

    <!-- WhatsApp FAB -->
    <a
      class="fixed bottom-6 right-6 z-50 w-16 h-16 bg-whatsapp-green text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
      href="https://wa.me/5511999999999?text=Oi"
      target="_blank"
    >
      <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
.hero-gradient {
  background: radial-gradient(circle at top right, #e8fff0 0%, #f8f9ff 100%);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

details > summary::-webkit-details-marker {
  display: none;
}

details > summary {
  list-style: none;
}
</style>
