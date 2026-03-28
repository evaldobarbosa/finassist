import { chromium } from 'playwright';
import * as readline from 'readline';

const SCREENSHOTS_DIR = 'docs/mockups/referencia';
let screenshotCount = 27;

async function shot(page, name) {
  screenshotCount++;
  const filename = `${SCREENSHOTS_DIR}/${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename });
  console.log(`📸 ${filename}`);
  return filename;
}

function waitForEnter(message) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

async function main() {
  console.log('🚀 Abrindo browser na página de login...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  await page.goto('https://granazen.com/login');
  await page.waitForLoadState('networkidle');

  console.log('✅ Página de login carregada');
  console.log('');
  console.log('👉 Faça o login manualmente no browser.');
  console.log('');

  await waitForEnter('Pressione ENTER quando estiver no dashboard...');

  console.log('\n🎯 Iniciando captura do dashboard...\n');

  // Capturar URL atual
  console.log('📍 URL atual:', page.url());

  // Capturar dashboard inicial
  await shot(page, 'dashboard-home');
  await page.waitForTimeout(2000);

  // Procurar menu lateral ou navegação
  console.log('\n🔍 Explorando navegação...\n');

  // Lista de possíveis links/menus para explorar
  const menuItems = [
    { name: 'transacoes', selectors: ['text=Transações', 'text=Transacoes', 'a[href*="transac"]'] },
    { name: 'receitas', selectors: ['text=Receitas', 'a[href*="receita"]'] },
    { name: 'despesas', selectors: ['text=Despesas', 'a[href*="despesa"]'] },
    { name: 'contas', selectors: ['text=Contas', 'a[href*="conta"]'] },
    { name: 'categorias', selectors: ['text=Categorias', 'a[href*="categoria"]'] },
    { name: 'relatorios', selectors: ['text=Relatórios', 'text=Relatorios', 'a[href*="relatorio"]'] },
    { name: 'metas', selectors: ['text=Metas', 'a[href*="meta"]'] },
    { name: 'configuracoes', selectors: ['text=Configurações', 'text=Config', 'a[href*="config"]'] },
    { name: 'perfil', selectors: ['text=Perfil', 'a[href*="perfil"]', 'a[href*="profile"]'] },
  ];

  for (const item of menuItems) {
    for (const selector of item.selectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          console.log(`\n--- ${item.name.toUpperCase()} ---`);
          await element.click();
          await page.waitForTimeout(2000);
          await page.waitForLoadState('networkidle').catch(() => {});
          await shot(page, item.name);
          console.log(`✅ Capturou: ${item.name}`);

          // Voltar para o dashboard
          await page.goBack();
          await page.waitForTimeout(1500);
          break;
        }
      } catch (e) {}
    }
  }

  // Captura final
  console.log('\n--- CAPTURA CONCLUÍDA ---\n');

  // Listar todos os screenshots
  console.log('📁 Screenshots capturados nesta sessão:');

  console.log('\n👀 Browser ainda aberto. Navegue manualmente se quiser.');
  console.log('   Me avise no chat para capturar telas específicas.');
  console.log('   Pressione Ctrl+C para fechar.\n');

  await new Promise(() => {});
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
});
