import { chromium } from 'playwright';

const SCREENSHOTS_DIR = 'docs/mockups/referencia';
let screenshotCount = 8;

async function screenshot(page, name) {
  screenshotCount++;
  const filename = `${SCREENSHOTS_DIR}/${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`✓ Capturado: ${filename}`);
  return filename;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navegando para o onboarding...');
  await page.goto('https://granazen.com/onboarding?code=908c63d6-53b3-4e2d-a433-e4ca3df65e5d%2Cad4325af-dab0-436e-86f5-f5c61e064747&amount=335%2C04&currency=brl&method=sp&event_id=e97aef47-d6a0-4498-a9e5-aa4f664500bb');

  await page.waitForLoadState('networkidle');
  await screenshot(page, 'onboarding-inicio');

  // Fechar modal de cookies se existir
  try {
    const cookieBtn = page.locator('button:has-text("Aceitar")');
    if (await cookieBtn.isVisible({ timeout: 2000 })) {
      await cookieBtn.click();
      console.log('✓ Fechou modal de cookies');
      await page.waitForTimeout(500);
    }
  } catch (e) {}

  // Clicar em Começar
  try {
    const comecarBtn = page.locator('button:has-text("Começar")');
    if (await comecarBtn.isVisible({ timeout: 3000 })) {
      await comecarBtn.click();
      console.log('✓ Clicou em Começar');
      await page.waitForTimeout(1500);
      await screenshot(page, 'onboarding-step1');
    }
  } catch (e) {
    console.log('Botão Começar não encontrado, continuando...');
  }

  // Loop para navegar pelas telas
  let stepNum = 2;
  let maxSteps = 20; // Limite de segurança

  while (stepNum <= maxSteps) {
    // Verificar se há campos de input visíveis que precisam ser preenchidos
    const inputs = page.locator('input:visible');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      console.log(`\n⚠️  Encontrados ${inputCount} campos para preencher:`);
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute('placeholder') || '';
        const name = await input.getAttribute('name') || '';
        const type = await input.getAttribute('type') || 'text';
        console.log(`   - Campo ${i+1}: type="${type}", name="${name}", placeholder="${placeholder}"`);
      }
      console.log('\n>>> Aguardando preenchimento manual. Preencha os campos no browser e pressione Enter aqui para continuar...');

      // Aguardar input do usuário
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });

      await screenshot(page, `onboarding-step${stepNum}-preenchido`);
    }

    // Tentar encontrar e clicar no botão de próximo/continuar/avançar
    const nextButtons = [
      'button:has-text("Próximo")',
      'button:has-text("Continuar")',
      'button:has-text("Avançar")',
      'button:has-text("Confirmar")',
      'button:has-text("Salvar")',
      'button:has-text("Enviar")',
      'button:has-text("Finalizar")',
      'button[type="submit"]'
    ];

    let clicked = false;
    for (const selector of nextButtons) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 })) {
          await btn.click();
          console.log(`✓ Clicou em: ${selector}`);
          clicked = true;
          await page.waitForTimeout(1500);
          await screenshot(page, `onboarding-step${stepNum}`);
          stepNum++;
          break;
        }
      } catch (e) {}
    }

    if (!clicked) {
      console.log('Nenhum botão de navegação encontrado. Capturando tela final...');
      await screenshot(page, 'onboarding-final');
      break;
    }

    // Verificar se chegou ao dashboard ou página final
    const url = page.url();
    if (url.includes('dashboard') || url.includes('home') || url.includes('app')) {
      console.log('✓ Chegou ao dashboard/app!');
      await screenshot(page, 'dashboard');
      break;
    }
  }

  console.log('\n✓ Captura concluída! Mantendo browser aberto para inspeção...');
  console.log('Pressione Ctrl+C para fechar.\n');

  // Manter aberto
  await new Promise(() => {});
}

main().catch(console.error);
