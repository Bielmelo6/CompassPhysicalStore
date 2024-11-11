export interface Store{
    nome: string;
    cep: string;
    location: Location;
    logradouro: string;
    complemento?: string;
    unidade?: string;
    bairro: string;
    localidade: string;
    uf: string;
    estado: string;
    regiao: string;
}

export interface Location{
    type: 'Point';
    coordinates: [number];
}