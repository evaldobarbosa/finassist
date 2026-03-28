import { chromium } from 'playwright';

const SCREENSHOTS_DIR = 'docs/mockups/referencia';
let screenshotCount = 12;

async function screenshot(page, name) {
  screenshotCount++;
  const filename = `${SCREENSHOTS_DIR}/${String(screenshotCount).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: filename, fullPage: false });
  console.log(`✓ Capturado: ${filename}`);
  return filename;
}

async function clickAndCapture(page, selector, description, screenshotName) {
  try {
    const element = page.locator(selector).first();
    if (await element.isVisible({ timeout: 3000 })) {
      await element.click();
      console.log(`✓ ${description}`);
      await page.waitForTimeout(1000);
      if (screenshotName) {
        await screenshot(page, screenshotName);
      }
      return true;
    }
  } catch (e) {
    console.log(`✗ Não encontrado: ${description}`);
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navegando para o onboarding...');
  await page.goto('https://granazen.com/onboarding?code=908c63d6-53b3-4e2d-a433-e4ca3df65e5d%2Cad4325af-dab0-436e-86f5-f5c61e064747&amount=335%2C04&currency=brl&method=sp&event_id=e97aef47-d6a0-4498-a9e5-aa4f664500bb');
  await page.waitForLoadState('networkidle');

  // Fechar cookies
  await clickAndCapture(page, 'button:has-text("Aceitar")', 'Fechou cookies', null);

  // Clicar em Começar
  await clickAndCapture(page, 'button:has-text("Começar")', 'Clicou em Começar', null);
  await page.waitForTimeout(1000);

  // Step 1: Idioma - já está PT-BR, só continuar
  await clickAndCapture(page, 'button:has-text("Continuar")', 'Passou idioma', null);
  await page.waitForTimeout(1000);

  // Step 2: Tipo de uso - selecionar "Pessoal e Empresarial"
  await clickAndCapture(page, 'text=Pessoal e Empresarial', 'Selecionou Pessoal e Empresarial', 'step2-tipo-uso');
  await page.waitForTimeout(500);
  await clickAndCapture(page, 'button:has-text("Continuar")', 'Continuou tipo de uso', null);
  await page.waitForTimeout(1000);

  // Capturar próxima tela (pode ser seleção de segmento)
  await screenshot(page, 'step2b-segmento');

  // Tentar selecionar segmento "Educação" ou similar
  const segmentos = ['Educação', 'Cursos', 'Educação e Cursos', 'Ensino'];
  for (const seg of segmentos) {
    const found = await clickAndCapture(page, `text=${seg}`, `Selecionou ${seg}`, null);
    if (found) break;
  }
  await page.waitForTimeout(500);

  // Loop para navegar pelo resto do onboarding
  let stepNum = 3;
  const maxSteps = 15;

  while (stepNum <= maxSteps) {
    // Capturar tela atual
    await screenshot(page, `step${stepNum}`);

    // Verificar se há seleções (radio buttons, cards clicáveis)
    const cards = page.locator('[role="radio"], [role="option"], .cursor-pointer');
    const cardCount = await cards.count();
    if (cardCount > 0) {
      // Selecionar primeira opção se nenhuma estiver selecionada
      try {
        const firstCard = cards.first();
        await firstCard.click();
        console.log('✓ Selecionou primeira opção');
        await page.waitForTimeout(500);
      } catch (e) {}
    }

    // Verificar se há inputs para preencher
    const inputs = page.locator('input:visible:not([type="hidden"])');
    const inputCount = await inputs.count();
    if (inputCount > 0) {
      console.log(`\n⚠️  Campos para preencher encontrados`);
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const placeholder = await input.getAttribute('placeholder') || '';
        const value = await input.inputValue();
        if (!value) {
          console.log(`   Campo ${i+1}: "${placeholder}"`);
        }
      }
    }

    // Tentar continuar
    const continued = await clickAndCapture(page, 'button:has-text("Continuar")', 'Continuou', null);
    if (!continued) {
      const next = await clickAndCapture(page, 'button:has-text("Próximo")', 'Próximo', null);
      if (!next) {
        const finish = await clickAndCapture(page, 'button:has-text("Finalizar")', 'Finalizou', null);
        if (!finish) {
          const confirm = await clickAndCapture(page, 'button:has-text("Confirmar")', 'Confirmou', null);
          if (!confirm) {
            const skip = await clickAndCapture(page, 'button:has-text("Pular")', 'Pulou', null);
            if (!skip) {
              console.log('Nenhum botão de navegação encontrado.');
              break;
            }
          }
        }
      }
    }

    await page.waitForTimeout(1500);
    stepNum++;

    // Verificar se chegou ao dashboard
    const url = page.url();
    if (url.includes('dashboard') || url.includes('/app')) {
      console.log('✓ Chegou ao dashboard!');
      await screenshot(page, 'dashboard');
      break;
    }
  }

  console.log('\n✓ Captura concluída! Browser aberto para inspeção.');
  console.log('Pressione Ctrl+C para fechar.\n');

  await new Promise(() => {});
}

main().catch(console.error);
