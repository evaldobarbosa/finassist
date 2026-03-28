import { chromium } from 'playwright';

const SCREENSHOTS_DIR = 'docs/mockups/referencia';
let screenshotCount = 15;

async function screenshot(page, name) {
  screenshotCount++;
  const filename = `${SCREENSHOTS_DIR}/${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`✓ Capturado: ${filename}`);
  return filename;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navegando para o onboarding...\n');
  await page.goto('https://granazen.com/onboarding?code=908c63d6-53b3-4e2d-a433-e4ca3df65e5d%2Cad4325af-dab0-436e-86f5-f5c61e064747&amount=335%2C04&currency=brl&method=sp&event_id=e97aef47-d6a0-4498-a9e5-aa4f664500bb');
  await page.waitForLoadState('networkidle');

  // Fechar cookies
  try {
    await page.click('button:has-text("Aceitar")', { timeout: 3000 });
    console.log('✓ Fechou cookies');
  } catch(e) {}

  // Começar
  try {
    await page.click('button:has-text("Começar")', { timeout: 3000 });
    console.log('✓ Clicou Começar');
    await page.waitForTimeout(1000);
  } catch(e) {}

  // Step 1: Idioma - continuar
  await page.click('button:has-text("Continuar")');
  console.log('✓ Step 1: Idioma OK');
  await page.waitForTimeout(1000);

  // Step 2: Tipo de uso
  await page.click('text=Pessoal e Empresarial');
  console.log('✓ Selecionou Pessoal e Empresarial');
  await page.waitForTimeout(500);

  // Abrir dropdown de segmento
  await page.click('text=Selecione o segmento');
  console.log('✓ Abriu dropdown de segmento');
  await page.waitForTimeout(500);
  await screenshot(page, 'dropdown-segmento');

  // Selecionar Educação
  try {
    await page.click('text=Educação', { timeout: 2000 });
    console.log('✓ Selecionou Educação');
  } catch(e) {
    // Tentar outras variações
    try {
      await page.click('text=Cursos', { timeout: 2000 });
      console.log('✓ Selecionou Cursos');
    } catch(e2) {
      console.log('⚠ Segmento não encontrado, continuando...');
    }
  }
  await page.waitForTimeout(500);
  await screenshot(page, 'segmento-selecionado');

  await page.click('button:has-text("Continuar")');
  console.log('✓ Step 2: Tipo de uso OK');
  await page.waitForTimeout(1500);

  // Loop pelos próximos steps
  const steps = [
    { name: 'Moeda', num: 3 },
    { name: 'Contas', num: 4 },
    { name: 'Categorias', num: 5 },
    { name: 'Despesas', num: 6 },
    { name: 'Receitas', num: 7 },
    { name: 'Lembretes', num: 8 },
    { name: 'WhatsApp', num: 9 },
  ];

  for (const step of steps) {
    await screenshot(page, `step${step.num}-${step.name.toLowerCase()}`);
    console.log(`\n--- Step ${step.num}: ${step.name} ---`);

    // Verificar se há campos de input
    const inputs = await page.locator('input:visible').count();
    if (inputs > 0) {
      console.log(`   ${inputs} campo(s) encontrado(s)`);
    }

    // Verificar se há cards/opções para selecionar
    const cards = await page.locator('[class*="cursor-pointer"]:visible, [role="radio"]:visible').count();
    if (cards > 0) {
      try {
        await page.locator('[class*="cursor-pointer"]:visible, [role="radio"]:visible').first().click();
        console.log('   ✓ Selecionou primeira opção');
        await page.waitForTimeout(300);
      } catch(e) {}
    }

    // Tentar continuar ou pular
    try {
      const continueBtn = page.locator('button:has-text("Continuar")');
      if (await continueBtn.isVisible({ timeout: 1000 })) {
        await continueBtn.click();
        console.log('   ✓ Continuou');
      }
    } catch(e) {
      try {
        const skipBtn = page.locator('button:has-text("Pular")');
        if (await skipBtn.isVisible({ timeout: 1000 })) {
          await skipBtn.click();
          console.log('   ✓ Pulou');
        }
      } catch(e2) {
        console.log('   ⚠ Sem botão de navegação');
        break;
      }
    }

    await page.waitForTimeout(1500);

    // Verificar se chegou ao final
    const url = page.url();
    if (url.includes('dashboard') || url.includes('/app')) {
      console.log('\n✓ CHEGOU AO DASHBOARD!');
      await screenshot(page, 'dashboard-inicial');
      break;
    }
  }

  // Capturar tela final
  await screenshot(page, 'final');

  console.log('\n========================================');
  console.log('✓ Onboarding capturado!');
  console.log('Browser aberto para navegação adicional.');
  console.log('========================================\n');

  // Manter aberto
  await new Promise(() => {});
}

main().catch(console.error);
