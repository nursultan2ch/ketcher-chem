import { Locator, test } from '@playwright/test';
import {
  addMonomerToCanvas,
  selectSingleBondTool,
  takeEditorScreenshot,
  waitForPageInit,
} from '@utils';
import { turnOnMacromoleculesEditor } from '@utils/macromolecules';
import { bondTwoMonomers } from '@utils/macromolecules/polymerBond';
/* eslint-disable no-magic-numbers */

test.describe('Modal window', () => {
  let peptide1: Locator;
  let peptide2: Locator;
  test.beforeEach(async ({ page }) => {
    await waitForPageInit(page);
    await turnOnMacromoleculesEditor(page);
    await page.getByText('CHEM').click();
    const MONOMER_NAME = 'Test-6-Ch___Test-6-AP-Chem';
    const MONOMER_ALIAS = 'Test-6-Ch';

    peptide1 = await addMonomerToCanvas(
      page,
      MONOMER_NAME,
      MONOMER_ALIAS,
      200,
      200,
      0,
    );
    peptide2 = await addMonomerToCanvas(
      page,
      MONOMER_NAME,
      MONOMER_ALIAS,
      400,
      400,
      1,
    );

    // Select bond tool
    await selectSingleBondTool(page);
  });

  test.afterEach(async ({ page }) => {
    await takeEditorScreenshot(page);
  });

  test('"Connect" button is disabled', async ({ page }) => {
    /*
      Description: Bond two monomers and open window. 
      "Connect" button is disabled
      */

    // Create bonds between peptides
    await bondTwoMonomers(page, peptide1, peptide2);
  });

  test('"Connect" button is active', async ({ page }) => {
    /*
      Description: Bond two monomers and open window. 
      Chose AP.
      "Connect" button is active
      */

    // Create bonds between peptides
    await bondTwoMonomers(page, peptide1, peptide2);

    // Chose attachment points
    await page.locator('button[title=R1]').nth(0).click();
    await page.locator('button[title=R2]').nth(1).click();
  });
});
