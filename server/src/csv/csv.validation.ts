import { Csv } from './csv.interface';
import { cnpj, cpf } from 'cpf-cnpj-validator';


export const CsvValidation = (csv: Csv): Csv => {

    const validatePayment = (vlTotal: string, qtPrestacoes: string, vlPresta: string, vlMora: string, vlDescon: string): boolean => {
        const monthlyPayment = parseInt(vlTotal) / parseInt(qtPrestacoes);
        
        if (
            parseInt(vlMora) > (parseInt(vlTotal) - parseInt(vlDescon)) ||
            monthlyPayment !== parseInt(vlPresta)
            ) return false;
        
        return true;
    };

    const validateDocument = (CpfCnpj: string): boolean => {
        const formatedCpfCnpj = CpfCnpj.replace(/\D/g, '');
        
        if (formatedCpfCnpj.length === 11) return cpf.isValid(formatedCpfCnpj);
        if (formatedCpfCnpj.length === 14) return cnpj.isValid(formatedCpfCnpj);

        return false
    };

    const convertBRL = (value: string): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string): Date => {
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1;
        const day = parseInt(dateString.substring(6, 8), 10);
    
        return new Date(year, month, day);
    };

    return {
        ...csv,
        vlTotal: convertBRL(csv.vlTotal),
        vlPresta: convertBRL(csv.vlPresta),
        vlMora: convertBRL(csv.vlMora),
        vlMulta: convertBRL(csv.vlMulta),
        vlOutAcr: convertBRL(csv.vlOutAcr),
        vlIof: convertBRL(csv.vlIof),
        vlDescon: convertBRL(csv.vlDescon),
        vlAtual: convertBRL(csv.vlAtual),
        dtContrato: formatDate(String(csv.dtContrato)),
        dtVctPre: formatDate(String(csv.dtVctPre)),
        isDocumentValid: validateDocument(csv.nrCpfCnpj),
        isPaymentValid: validatePayment(csv.vlTotal, csv.qtPrestacoes, csv.vlPresta, csv.vlMora, csv.vlDescon)
    };
}