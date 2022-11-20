import { __extends } from "tslib";
var ClientError = /** @class */ (function (_super) {
    __extends(ClientError, _super);
    function ClientError(errors) {
        var _newTarget = this.constructor;
        var _this = this;
        var message = ClientError.extractMessage(errors);
        _this = _super.call(this, errors ? "".concat(message, "\n").concat(errors.map(function (error) { return JSON.stringify(error, null, 2); }).join("\n")) : message) || this;
        _newTarget.prototype.name = _newTarget.name;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        if (Error.captureStackTrace)
            Error.captureStackTrace(_this, ClientError);
        return _this;
    }
    ClientError.extractMessage = function (errors) {
        try {
            return errors[0].message;
        }
        catch (e) {
            return "GraphQL Error";
        }
    };
    return ClientError;
}(Error));
export { ClientError };
//# sourceMappingURL=error.js.map