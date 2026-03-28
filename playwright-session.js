const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navegar para a página
  await page.goto('https://granazen.com/onboarding?code=908c63d6-53b3-4e2d-a433-e4ca3df65e5d%2Cad4325af-dab0-436e-86f5-f5c61e064747&amount=335%2C04&currency=brl&method=sp&event_id=e97aef47-d6a0-4498-a9e5-aa4f664500bb');

  // Aguardar a página carregar
  await page.waitForLoadState('networkidle');

  // Capturar screenshot inicial
  await page.screenshot({ path: 'docs/mockups/referencia/08-onboarding-01-inicio.png' });
  console.log('Screenshot 08-onboarding-01-inicio.png capturado');

  // Clicar no botão "Começar"
  await page.click('button:has-text("Começar")');
  console.log('Clicou em Começar');

  // Aguardar transição
  await page.waitForTimeout(1500);

  // Capturar screenshot após clicar
  await page.screenshot({ path: 'docs/mockups/referencia/08-onboarding-02-apos-comecar.png' });
  console.log('Screenshot 08-onboarding-02-apos-comecar.png capturado');

  // Manter browser aberto para inspeção
  console.log('Browser aberto. Pressione Ctrl+C para fechar.');

  // Aguardar indefinidamente (até o usuário fechar)
  await new Promise(() => {});
})();
