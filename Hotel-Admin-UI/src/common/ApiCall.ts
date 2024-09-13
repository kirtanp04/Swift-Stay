import axiosCall from "src/service/axios";
import { Crypt } from "./Crypt";
import { ProjectResponse } from "./Response";
import { Storage } from "./Storage";
import { enumUserRole } from "src/pages/Authentication/AuthMgr";

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
  _getParam.data = _data;
  return _getParam;
};

export class Api {
  static async get(
    _Param: TParam,
    onResponse: (res: ProjectResponse) => void,
    onProgress?: (progress: number) => void
  ) {
    let _res = new ProjectResponse();
    try {
      const encryptData = Crypt.Encryption(_Param);

      if (encryptData.error === "") {
        const response = await axiosCall.get(encryptData.data, {
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.total;
            const current = progressEvent.loaded;
            const percentCompleted = Math.floor((current / total!) * 100);
            if (onProgress !== undefined) {
              onProgress(percentCompleted);
            }
          },
        });

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
      onResponse(_res);
    }
  }
  static async post(
    _Param: TParam,
    data: any,
    onResponse: (res: ProjectResponse) => void
  ) {
    let _res = new ProjectResponse();
    debugger
    try {
      const encryptParamData = Crypt.Encryption(_Param);

      if (encryptParamData.error === "") {
        const encryptedData = Crypt.Encryption(data);

        if (encryptedData.error === "") {
          const response = await axiosCall.post(encryptParamData.data, {
            data: encryptedData.data,
          });
          debugger
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
      onResponse(_res);
    }
  }

  static async protectedGet(
    _Param: TParam,
    onResponse: (res: ProjectResponse) => void,
    onProgress?: (progress: number) => void
  ) {
    let _res = new ProjectResponse();

    try {
      const objRes = Storage.getFromSessionStorage("Auth");
      if (objRes.error === "") {
        debugger
        if (objRes.data.role === enumUserRole.admin) {
          const encryptParamData = Crypt.Encryption(_Param);
          if (encryptParamData.error === "") {
            const response = await axiosCall.get(encryptParamData.data, {
              onDownloadProgress: (progressEvent) => {
                const total = progressEvent.total;
                const current = progressEvent.loaded;

                if (total && current) {
                  const percentCompleted = Math.floor((current / total) * 100);
                  if (onProgress !== undefined) {

                    onProgress(percentCompleted);
                  }
                }
              },
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
            _res.error = encryptParamData.error;
          }
        } else {
          _res.error =
            "Your are not allowed to perform this call as you are not an admin. First login through admin account.";
        }
      } else {
        _res.error =
          "You are not authenticated to perform this call. Login to your account first.";
      }
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      onResponse(_res);
    }
  }

  static async protectedPost(
    _Param: TParam,
    data: any,
    onResponse: (res: ProjectResponse) => void
  ) {
    let _res = new ProjectResponse();
    const objRes = Storage.getFromSessionStorage("Auth");

    try {
      if (objRes.error === "") {
        if (objRes.data.role === enumUserRole.admin) {
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
        } else {
          _res.error =
            "Your are not allowed to perform this call as you are not an admin. First login through admin account.";
        }
      } else {
        _res.error =
          "You are not authenticated to perform this call. Login to your account first.";
      }
    } catch (error: any) {
      const objDecrypterr = Crypt.Decryption(error.response.data);
      if (objDecrypterr.error === "") {
        _res.error = objDecrypterr.data.Message;
      } else {
        _res.error = "Not able to decrypt api error";
      }
    } finally {
      onResponse(_res);
    }
  }
}
