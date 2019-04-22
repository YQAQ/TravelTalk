import { Toast } from 'antd-mobile';

export default (request) => {
  return () => {
    return next => (action) => {
      const {
        api,
        types,
        showLoading,
        showToast,
      } = action;
      if (!api || !Array.isArray(types)) {
        return next(action);
      }
      const [LOADING, SUCCESS, FAILURE] = types;

      next({
        type: LOADING,
        result: {
          loading: true,
          success: false,
        },
        ...action,
      });

      if (showLoading) {
        Toast.loading(
          typeof showLoading === 'string' ? showLoading : '正在加载...'
        );
      }

      const timeStamp = Date.now();

      const apiPromise = api(({
        api: apiType = '',
        method = 'POST',
        query = {},
        params = {},
      }) => {
        return request({
          url: `/${apiType}`,
          method,
          data: {
            lang: 'zh_cn',
            net: 2,
            ver: '',
            dev: 0,
            uid: '',
            query: {
              ...query,
            },
            api: apiType,
            qid: timeStamp,
            ...params,
          },
          // 以下参数会作为url中的query string
          params: {
            type: apiType,
            qid: timeStamp,
            ...params,
          },
        });
      });

      const resolveFn = (data = {}, resolve) => {
        next({
          type: SUCCESS,
          result: {
            ...data,
            loading: false,
            success: true,
          },
          ...action,
        });
        resolve(data);
      };

      const rejectFn = (error = {}, reject) => {
        next({
          type: FAILURE,
          result: {
            ...error,
            loading: false,
            success: false,
          },
          ...action,
        });
        reject(error);
      };

      const requestPromise = new Promise((resolve, reject) => {
        apiPromise
          .then((res) => {
            if (showLoading) {
              Toast.hide();
            }
            const { data } = res || {};
            const error = (data && data.error) || {};
            const errorId = error.error_id;
            const errorStr = error.error_str;
            if (errorId === 0) {
              resolveFn(data, resolve);
            } else {
              if (showToast && errorStr) {
                Toast.info(errorStr, 1);
              }
              rejectFn(error, reject);
            }
          })
          .catch((err) => {
            if (showLoading) {
              Toast.hide();
            }
            if (/[offline|Network]/.test(err.message)) {
              Toast.info('请检查网络连接', 1);
            } else if (err.response && /^[45][0-9]{2}$/.test(err.response.status) && showToast) {
              Toast.info('oops，出了点儿小问题，请联系你的客户经理解决', 1);
            }
            rejectFn(err, reject);
          });
      });

      return requestPromise;
    };
  };
};
