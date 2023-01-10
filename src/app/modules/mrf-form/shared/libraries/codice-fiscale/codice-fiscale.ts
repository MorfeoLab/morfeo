/**
 * Class for Italian Codice Fiscale normalization, formatting and checking.
 * @author Daniele Alessandra <daniele@danielealessandra.com>
 * Based on JavaScript class by Umberto Salsi <salsi@icosaedro.it>
 */
export class CodiceFiscale {

    /**
     * Normalizes a CF by removing white spaces and converting to upper-case.
     * @param cf Raw CF, possibly with spaces.
     * @return Normalized CF.
     */
    static normalize(cf: string): string {
        return cf.replace(new RegExp('/\s/g'), '').toUpperCase();
    }


    /**
     * Returns the formatted CF. Currently does nothing but normalization.
     * @param cf Raw CF, possibly with spaces.
     * @return Formatted CF.
     */
    static format(cf: string): string {
        return CodiceFiscale.normalize(cf);
    }


    /**
     * Validates a regular CF.
     * @param cf Normalized, 16 characters CF.
     * @return Null if valid, or string describing why this CF must be
     * rejected.
     */
    private static validate_regular(cf: string): string | null {
        if (!new RegExp('^[0-9A-Z]{16}$').test(cf)) {
            return 'Invalid characters.';
        }
        let s = 0;
        const evenMap = 'BAFHJNPRTVCESULDGIMOQKWZYX';
        for (let i = 0; i < 15; i++) {
            const c = cf[i];
            let n = 0;
            if (0 <= +c && +c <= 9) {
                n = +c;
            } else {
                n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c);
            }
            if ((i % 2) === 0) {
                n = evenMap.charCodeAt(n) - 'A'.charCodeAt(0);
            }
            s += n;
        }
        if (s % 26 + 'A'.charCodeAt(0) !== cf.charCodeAt(15)) {
            return 'Invalid checksum.';
        }
        return null;
    }


    /**
     * Validates a temporary CF.
     * @param cf Normalized, 11 characters CF.
     * @return Null if valid, or string describing why this CF must be
     * rejected.
     */
    private static validate_temporary(cf: string): string | null {
        if (!new RegExp('^[0-9]{11}$').test(cf)) {
            return 'Invalid characters.';
        }
        let s = 0;
        for (let i = 0; i < 11; i++) {
            let n = cf.charCodeAt(i) - '0'.charCodeAt(0);
            if ((i % 2) === 1) {
                n *= 2;
                if (n > 9) {
                    n -= 9;
                }
            }
            s += n;
        }
        if (s % 10 !== 0) {
            return 'Invalid checksum.';
        }
        return null;
    }


    /**
     * Verifies the basic syntax, length and control code of the given CF.
     * @param cf Raw CF, possibly with spaces.
     * @return Null if valid, or string describing why this CF must be
     * rejected.
     */
    public static validate(cf: string): string | null {
        if (!new RegExp('^[0-9A-Z]+$').test(cf.toUpperCase())) {
            return 'Invalid characters.';
        }
        cf = CodiceFiscale.normalize(cf);
        if (cf.length === 0) {
            return 'Empty.';
        } else if (cf.length === 16) {
            return CodiceFiscale.validate_regular(cf);
        } else if (cf.length === 11) {
            return CodiceFiscale.validate_temporary(cf);
        } else {
            return 'Invalid length.';
        }
    }
}
