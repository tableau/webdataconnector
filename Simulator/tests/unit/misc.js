import should from 'should';
import * as consts from '../../utils/consts.js';
import { cleanUrl } from '../../utils/misc.js';
import { validateUrl } from '../../utils/validation.js';

//Validation Tests
describe("Misc Utils", function() {
  describe("Clean Url Missing http://", function() {
    it("Should Clean an Invalid Url", function() {
      const data = "notAUrl.com";
      should.equal("http://notAUrl.com", cleanUrl(data));
    });

    it("Not Clean a Valid Url", function() {
      const data = "https://notAUrl.com";
      should.notEqual("http://notAUrl.com", cleanUrl(data));
    });

    it("Not Clean a Valid Path", function() {
      const data = "../notAUrl.com";
      should.notEqual("http://../notAUrl.com", cleanUrl(data));
    });
  });
});
