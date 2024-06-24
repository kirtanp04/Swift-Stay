import axiosCall from "src/service/axios";
import { Crypt } from "./Crypt";
import { ProjectResponse } from "./Response";

export class TParam {
  Broker: string = "";

  function: string = "";

  data: any = "";
}

export const getPostParamData = (
  _BrokerName: string,
  _functionName: string
): TParam => {
  let _postParam = new TParam();
  _postParam.Broker = _BrokerName;
  _postParam.function = _functionName;
  return _postParam;
};
export const getGETParamData = (
  _BrokerName: string,
  _functionName: string,
  _data: any
): TParam => {
  let _getParam = new TParam();
  _getParam.Broker = _BrokerName;
  _getParam.function = _functionName;
  _getParam.data = _data
  return _getParam;
};

export class Api {
  static async get(_Param: TParam): Promise<ProjectResponse> {
    let _res = new ProjectResponse();
    try {
      const encryptData = Crypt.Encryption(_Param);

      if (encryptData.error === "") {
        const response = await axiosCall.get(encryptData.data);
        console.log(response)
      } else {
        _res.error = encryptData.error;
      }
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      return _res;
    }
  }
  static async post(_Param: TParam, data: any): Promise<ProjectResponse> {
    let _res = new ProjectResponse();

    try {
      const encryptParamData = Crypt.Encryption(_Param);

      if (encryptParamData.error === "") {
        const encryptedData = Crypt.Encryption(data);

        if (encryptedData.error === "") {
          const response = await axiosCall.post(encryptParamData.data, {
            data: encryptedData.data,
          });
          if (response) {
            const objDecryptRes = Crypt.Decryption(response.data);
            if (objDecryptRes.data.isError === false) {
              _res.data = objDecryptRes.data.data;
            } else {
              _res.error = objDecryptRes.data.Message;
            }
          } else {
            _res.error = "Getting response Undefine";
          }
        } else {
          _res.error = encryptedData.error;
        }
      } else {
        _res.error = encryptParamData.error;
      }
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      return _res;
    }
  }

  static async protectedGet(_Param: TParam): Promise<ProjectResponse> {
    let _res = new ProjectResponse();

    try {
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      return _res;
    }
  }

  static async protectedPost(_Param: TParam): Promise<ProjectResponse> {
    let _res = new ProjectResponse();

    try {
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      return _res;
    }
  }
}
