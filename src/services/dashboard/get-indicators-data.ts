
export async function getIndicatorsData(){

    await new Promise((resolve) => setTimeout(resolve, 5000))
    const dataFake = [
        {
            label: 'OLTs',
            value: 100,
        },
        {
            label: 'Usuarios',
            value: 150,
        },
        {
            label: 'Grupos',
            value: 350,
        },
        {
            label: 'Interações',
            value: 950,
        }
    ]

    return dataFake


}

export const initialData = [
    { label: 'OLTs', value: 0 },
    { label: 'Usuarios', value: 0 },
    { label: 'Grupos', value: 0 },
    { label: 'Interações', value: 0 }
]
