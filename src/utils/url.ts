export function getQueryParam(name: string, url?: string): string | null {
    try{
        const src = url ?? (typeof window !== 'undefined' ? window.location.href : '');
        if(!src) return null;
        const u = new URL(src, window?.location?.origin ?? undefined);
        return u.searchParams.get(name);
    }catch(e){
        // fallback: parse manually
        const query = (url || '').split('?')[1] || '';
        const params = new URLSearchParams(query);
        return params.get(name);
    }
}
