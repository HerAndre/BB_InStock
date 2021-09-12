// takes objects containing errors and tries to extract them
export default (error) => {
  let msg;
  if (error.response) {
    if (error.response.data && error.response.data.error) {
      if (Array.isArray(error.response.data.error)) {
        msg = error.response.data.error.map((e) => e.error).join('\r\n');
      } else {
        msg = error.response.data.error;
      }
    } else if (error.response.data) {
      msg = error.response.data;
    } else if (error.response.statusText) {
      msg = error.response.statusText;
    }

    if (error.response.status) {
      msg = `[${error.response.status}] ${msg}`;
    }
  } else {
    msg = error.message || error.msg || error.error || error.type || error.text
      || 'An unknown error has occurred.';
  }
  return msg;
};