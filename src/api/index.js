function parseJSON (response) {
  return new Promise(
    resolve => response.json()
      .then(json => resolve({
        status: response.status,
        ok: response.ok,
        json
      }))
  )
}

function parseParams (params, url) {
  Object.keys(params).forEach(
    key => url.searchParams.append(key, params[key])
  )
  return url
}

export default (url, params) => {
  if (params) {
    url = parseParams(params, url)
  }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(parseJSON)
      .then((response) => {
        if (response.ok) {
          return resolve(response.json)
        }
        // extract the error from the server's json
        return reject(response.json.error)
      })
      .catch((error) => reject({
        networkError: error.message
      }))
  })
}

