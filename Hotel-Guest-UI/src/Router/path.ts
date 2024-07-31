



const rootPath = '/'

export const Path = {
    root: rootPath,
    login: rootPath + 'signin',
    signup: rootPath + 'signup',
    PropertyListByState: {
        root: (countryName: string, stateName: string) => encodeURI(rootPath + encodeURI(`/${countryName}`) + encodeURI(`/${stateName}`))
    }
}