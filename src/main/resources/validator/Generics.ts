export class GenericsValidator {
  /**
   * Valida um CPF ou CNPJ
   * @param cpfCnpj string
   */
  public cpfCnpj(
    cpfCnpj: string,
  ): { type: 'CPF' | 'CNPJ' | 'DOCUMENTO'; value: string | false } {
    if (typeof cpfCnpj === 'string') {
      cpfCnpj = this.onlyNumbers(cpfCnpj).toString();

      if (cpfCnpj.length === 11) {
        const cpf = this.cpf(cpfCnpj);

        return { type: 'CPF', value: cpf };
      }

      if (cpfCnpj.length === 14) {
        const cnpj = this.cnpj(cpfCnpj);

        return { type: 'CNPJ', value: cnpj };
      }
    }

    return { type: 'DOCUMENTO', value: false };
  }

  /**
   * Se for válido, retorna o cpf SEM formatação
   * @param cpf string
   */
  public cpf(cpf: string): string | false {
    if (typeof cpf === 'string') {
      cpf = this.onlyNumbers(cpf).toString();

      if (this.allCharcatersAreEquals(cpf) || cpf.length !== 11) {
        return false;
      }

      let numero = 0;
      let caracter = '';
      const numeros = '0123456789';
      let j = 10;
      let somatorio = 0;
      let resto = 0;
      let digito1 = 0;
      let digito2 = 0;
      let cpfAux = '';
      cpfAux = cpf.substring(0, 9);
      for (let i = 0; i < 9; i++) {
        caracter = cpfAux.charAt(i);
        if (numeros.search(caracter) === -1) {
          return false;
        }

        numero = Number(caracter);
        somatorio += numero * j;
        j--;
      }
      resto = somatorio % 11;
      digito1 = 11 - resto;
      if (digito1 > 9) {
        digito1 = 0;
      }
      j = 11;
      somatorio = 0;
      cpfAux += digito1;
      for (let i = 0; i < 10; i++) {
        caracter = cpfAux.charAt(i);
        numero = Number(caracter);
        somatorio += numero * j;
        j--;
      }
      resto = somatorio % 11;
      digito2 = 11 - resto;
      if (digito2 > 9) {
        digito2 = 0;
      }
      cpfAux += digito2;
      if (cpf !== cpfAux) {
        return false;
      }

      return cpf;
    }

    return false;
  }

  /**
   * Se for valido, retorna o cnpj SEM formatação
   * @param cnpj string
   */
  public cnpj(cnpj: string): string | false {
    if (typeof cnpj === 'string') {
      cnpj = this.onlyNumbers(cnpj).toString();

      // Se vier todos os caracteres iguais, não é um cnpj válido a ser comparado
      const isValidToCompare = !this.allCharcatersAreEquals(cnpj, 13);

      if (isValidToCompare && cnpj.length === 14) {
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let resultado = 0;

        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
          const digito = Number(numeros.charAt(tamanho - i));
          soma += digito * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        const digito0 = Number(digitos.charAt(0));

        if (resultado !== digito0) {
          return false;
        }

        tamanho++;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          const digito = Number(numeros.charAt(tamanho - i));
          soma += digito * pos--;
          if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

        const digito1 = Number(digitos.charAt(1));

        return resultado === digito1 ? cnpj : false;
      }
    }

    return false;
  }

  /**
   * Traz apenas numeros de uma string
   * @param str string a ser convertida
   * @param asNumber boolean vai retornar como numero?
   */
  public onlyNumbers(str: string, asNumber = false): number | string | false {
    if (typeof str === 'string') {
      str = str.replace(/[^0-9]/g, '');

      return asNumber ? Number(str) : str;
    }

    return false;
  }

  /**
   * Verifica se todos os caracteres de uma string são iguais
   * @param str string
   * @param length tamanho a ser validado. Padrão: str.length - 1
   */
  public allCharcatersAreEquals(str: string, length?): boolean {
    const regex = new RegExp(`(\\d)\\1{${length - 1 || str.length}}`);
    return !!str.match(regex);
  }
}
