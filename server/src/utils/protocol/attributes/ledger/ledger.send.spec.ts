// Import necessary dependencies and the class to be tested
import { LedgerSendAnalyzer } from './ledger.send';
import { Address } from "@liftedinit/many-js";
import { Big } from "big.js";

// Mocking the dependencies
jest.mock("@liftedinit/many-js", () => ({
  Address: jest.fn(),
}));

// Describe block to group tests related to LedgerSendAnalyzer
describe('LedgerSendAnalyzer', () => {
  describe('parseArgs', () => {
    it('should parse bigint correctly', () => {

      const values = ["100000000000", "1000000000000000000001", "100000000000000000000001"];

      for (const value of values) {

        // Mock data
        const payload = new Map<number, any>([
          [0, new Address()], // Sender Address
          [1, new Address()], // Receiver Address
          [2, BigInt(value)], // Amount
          [3, 'MFX'], // Symbol
          [4, ['memo1', 'memo2']], // Memo
        ]);

        const amount = Big(payload.get(2)).toFixed();
      
        // Assertions
        expect(typeof amount).toBe('string');
        expect(amount.toString()).toEqual(Big(value).toFixed());
      }

    });

  });
});
