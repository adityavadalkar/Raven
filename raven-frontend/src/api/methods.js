export const sendRequests = async (method, url, headers = {}, body) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: true, message: data.message || 'An error occurred' };
        }

        return data;
    } catch (error) {
        return { error: true, message: error.message || 'An error occurred' };
    }
}

export const deleteRequest = async (url, headers = {}) => {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: true, message: data.message || 'An error occurred' };
        }

        return data;
    } catch (error) {
        return { error: true, message: error.message || 'An error occurred' };
    }
}

export const getRequest = async (url, headers = {}) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: true, message: data.message || 'An error occurred' };
        }

        return data;
    } catch (error) {
        return { error: true, message: error.message || 'An error occurred' };
    }
}
