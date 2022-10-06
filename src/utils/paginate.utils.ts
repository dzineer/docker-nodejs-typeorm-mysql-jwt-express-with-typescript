export const pageinate = (items: any, page, perPage) => {
    const total = items.length;
    const last_page = Math.ceil(total / perPage);
    const data = items.slice((page - 1) * perPage, page * perPage)
    return {
        data,
        pagination: {
            page: page,
                total,
                last_page,
                metadata: {
                count: data.length,
            }
        }
    }
}