const fetchTools = {
    async getResource(url, params = {}) {
        const urlObj = new URL(url);

        Object.entries(params)
            .forEach(([key, value]) => value && urlObj.searchParams.append(key, value));

        const response = await fetch(urlObj);
        return await response.json();
    },


    async createResource(url, objToCreate) {

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(objToCreate),
        });

        return await response.json();
    },

    async updateResource(url, id, objToModify) {

        const response = await fetch(`${url}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(objToModify),
        });

        return await response.json();
    },

    async deleteResource(url, id) {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
        });

        return await response.json();
    },
}

export default fetchTools;
