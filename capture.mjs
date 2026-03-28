import { chromium } from 'playwright';

const SCREENSHOTS_DIR = 'docs/mockups/referencia';
let screenshotCount = 17;

async function shot(page, name) {
  screenshotCount++;
  const filename = `${SCREENSHOTS_DIR}/${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename });
  console.log(`📸 ${filename}`);
}

async function main() {
  console.log('🚀 Iniciando...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('https://granazen.com/onboarding?code=908c63d6-53b3-4e2d-a433-e4ca3df65e5d%2Cad4325af-dab0-436e-86f5-f5c61e064747&amount=335%2C04&currency=brl&method=sp&event_id=e97aef47-d6a0-4498-a9e5-aa4f664500bb');
  await page.waitForLoadState('networkidle');
  console.log('✅ Página carregada\n');

  // Cookies
  const cookieBtn = page.getByRole('button', { name: /aceitar/i });
  if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await cookieBtn.click();
    console.log('✅ Cookies aceitos');
  }

  // Começar
  await page.getByRole('button', { name: /começar/i }).click();
  console.log('✅ Clicou Começar');
  await page.waitForTimeout(1000);

  // Step 1: Idioma
  await page.getByRole('button', { name: /continuar/i }).click();
  console.log('✅ Step 1: Idioma\n');
  await page.waitForTimeout(1000);

  // Step 2: Tipo de uso - SELECIONAR PESSOAL E EMPRESARIAL
  await shot(page, 'step2-tipo-uso');
  await page.getByText('Pessoal e Empresarial', { exact: false }).click();
  console.log('✅ Selecionou: PESSOAL E EMPRESARIAL');
  await page.waitForTimeout(800);

  // Dropdown segmento - SELECIONAR EDUCAÇÃO
  const select = page.locator('select');
  if (await select.isVisible({ timeout: 3000 }).catch(() => false)) {
    // Listar opções disponíveis
    const options = await select.locator('option').allTextContents();
    console.log('📋 Opções de segmento:', options.filter(o => o !== 'Selecione o segmento').join(', '));

    // Procurar por educação
    const educacaoOption = options.find(o =>
      o.toLowerCase().includes('educa') ||
      o.toLowerCase().includes('curso') ||
      o.toLowerCase().includes('ensino')
    );

    if (educacaoOption) {
      await select.selectOption({ label: educacaoOption });
      console.log(`✅ Selecionou segmento: ${educacaoOption}`);
    } else {
      console.log('⚠️ Educação não encontrado nas opções');
      // Selecionar qualquer opção para continuar
      await select.selectOption({ index: 1 });
    }
  }
  await page.waitForTimeout(500);
  await shot(page, 'step2-segmento-educacao');

  await page.getByRole('button', { name: /continuar/i }).click();
  console.log('✅ Step 2: Tipo de uso completo\n');
  await page.waitForTimeout(1000);

  // Step 3: Moeda
  await shot(page, 'step3-moeda');
  await page.getByRole('button', { name: /continuar/i }).click();
  console.log('✅ Step 3: Moeda\n');
  await page.waitForTimeout(1000);

  // Função auxiliar para steps com pular/continuar
  async function handleStep(page, stepNum, stepName) {
    await shot(page, `step${stepNum}-${stepName}`);

    const pular = page.getByRole('button', { name: /pular/i });
    const continuar = page.getByRole('button', { name: /continuar/i });
    const finalizar = page.getByRole('button', { name: /finalizar/i });

    if (await pular.isVisible({ timeout: 1500 }).catch(() => false)) {
      await pular.click();
      console.log(`✅ Step ${stepNum}: ${stepName} (pulou)\n`);
    } else if (await continuar.isVisible({ timeout: 1500 }).catch(() => false)) {
      await continuar.click();
      console.log(`✅ Step ${stepNum}: ${stepName}\n`);
    } else if (await finalizar.isVisible({ timeout: 1500 }).catch(() => false)) {
      await finalizar.click();
      console.log(`✅ Step ${stepNum}: ${stepName} (finalizou)\n`);
    } else {
      console.log(`⚠️ Step ${stepNum}: ${stepName} - sem botão encontrado\n`);
    }

    await page.waitForTimeout(1200);
  }

  // Steps 4-9
  await handleStep(page, 4, 'contas');
  await handleStep(page, 5, 'categorias');
  await handleStep(page, 6, 'despesas');
  await handleStep(page, 7, 'receitas');
  await handleStep(page, 8, 'lembretes');
  await handleStep(page, 9, 'whatsapp');

  // Dashboard ou tela final
  await page.waitForTimeout(2000);
  await shot(page, 'dashboard');
  console.log('🎉 ONBOARDING COMPLETO!\n');

  console.log('📍 URL atual:', page.url());

  // Manter browser aberto
  console.log('\n👀 Browser aberto para você explorar. Ctrl+C para fechar.');
  await new Promise(() => {});
}

main().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
