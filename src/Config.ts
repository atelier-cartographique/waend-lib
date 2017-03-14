

interface ConfigStore {
    [key: string]: string;
}

const store: ConfigStore = {};



export const getconfig: (a: string) => Promise<string> =
    (key) => {

        if (key in store) {
            return Promise.resolve(store[key]);
        }

        return (
            fetch(`/api/config/${key}`)
                .then((response) => {
                    if (!response.ok) {
                        throw (new Error(`FaildConfig ${key}`));
                    }
                    return response.text();
                })
                .then<string>((text) => {
                    store[key] = text;
                    return text;
                })
        );

    }