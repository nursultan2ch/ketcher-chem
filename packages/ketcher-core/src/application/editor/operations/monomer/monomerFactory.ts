import {
  PeptideRenderer,
  ChemRenderer,
  BaseMonomerRenderer,
  RNABaseRenderer,
  SugarRenderer,
  PhosphateRenderer,
} from 'application/render/renderers';
import { MonomerItemType } from 'domain/types';
import { Peptide } from 'domain/entities/Peptide';
import { Chem } from 'domain/entities/Chem';
import { Sugar } from 'domain/entities/Sugar';
import { Phosphate } from 'domain/entities/Phosphate';
import { RNABase } from 'domain/entities/RNABase';
import { monomerClass } from 'application/formatters/types/ket';

type DerivedClass<T> = new (...args: unknown[]) => T;
export const MONOMER_CONST = {
  AMINO_ACID: 'AminoAcid',
  PEPTIDE: 'PEPTIDE',
  CHEM: 'CHEM',
  RNA: 'RNA',
  DNA: 'DNA',
  MODDNA: 'MODDNA',
  R: 'R', // states for Ribose
  P: 'P', // states for Phosphate
  SUGAR: 'SUGAR',
  BASE: 'BASE',
  PHOSPHATE: 'PHOSPHATE',
};

type Monomer =
  | typeof Chem
  | typeof Sugar
  | typeof Peptide
  | typeof RNABase
  | typeof Phosphate;

export const monomerFactory = (
  monomer: MonomerItemType,
): [
  Monomer: Monomer,
  MonomerRenderer: DerivedClass<BaseMonomerRenderer>,
  monomerClass: monomerClass,
] => {
  let Monomer;
  let MonomerRenderer;
  let monomerClass: monomerClass;

  if (
    monomer.props.MonomerType === MONOMER_CONST.CHEM ||
    (monomer.props.MonomerType === MONOMER_CONST.RNA &&
      (monomer.props.MonomerClass === MONOMER_CONST.MODDNA ||
        monomer.props.MonomerClass === MONOMER_CONST.DNA))
  ) {
    Monomer = Chem;
    MonomerRenderer = ChemRenderer;
    monomerClass = 'CHEM';
  } else if (monomer.props.MonomerType === MONOMER_CONST.PEPTIDE) {
    Monomer = Peptide;
    MonomerRenderer = PeptideRenderer;
    monomerClass = 'PEPTIDE';
  } else {
    if (monomer.props.MonomerNaturalAnalogCode === MONOMER_CONST.R) {
      Monomer = Sugar;
      MonomerRenderer = SugarRenderer;
      monomerClass = 'RNA';
    } else if (monomer.props.MonomerNaturalAnalogCode === MONOMER_CONST.P) {
      Monomer = Phosphate;
      MonomerRenderer = PhosphateRenderer;
      monomerClass = 'RNA';
    } else {
      Monomer = RNABase;
      MonomerRenderer = RNABaseRenderer;
      monomerClass = 'RNA';
    }
  }

  return [Monomer, MonomerRenderer, monomerClass];
};
