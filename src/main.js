const waitOneSecond = (x) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x)
    }, 1000)
  })
}

export default async (data) => {
  const pages = ['empty', ...data]
  const api = await waitOneSecond(async (n) => {
    const result = await waitOneSecond(pages[n])
    return result
  })
  api.size = pages.length

  return api
}
