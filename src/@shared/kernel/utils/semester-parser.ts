export class SemesterParser {
  private static readonly SEMESTER_VARIANTS: Record<number, string[]> = {
    1: ['1', 'primeiro', '1º'],
    2: ['2', 'segundo', '2º'],
    3: ['3', 'terceiro', '3º'],
    4: ['4', 'quarto', '4º'],
    5: ['5', 'quinto', '5º'],
    6: ['6', 'sexto', '6º'],
    7: ['7', 'sétimo', 'setimo', '7º'],
    8: ['8', 'oitavo', '8º'],
    9: ['9', 'nono', '9º'],
    10: ['10', 'décimo', 'decimo', '10º'],
    11: [
      '11',
      'décimo primeiro',
      'decimo primeiro',
      'décimo-primeiro',
      'decimo-primeiro',
      '11º',
    ],
    12: [
      '12',
      'décimo segundo',
      'decimo segundo',
      'décimo-segundo',
      'decimo-segundo',
      '12º',
    ],
  }

  static parseSemester(tag: string): number | undefined {
    const normalizedTag = tag.toLowerCase().trim()

    for (const [semester, variants] of Object.entries(
      SemesterParser.SEMESTER_VARIANTS,
    )) {
      if (variants.includes(normalizedTag)) {
        return Number.parseInt(semester, 10)
      }
    }

    return undefined
  }
}
