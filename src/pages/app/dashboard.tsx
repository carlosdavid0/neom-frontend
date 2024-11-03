import { IndicatorsDashboard } from '@/components/cards/indicatiors-dashboard';
import { ContentLayout } from '@/components/content-layout';
import { getIndicatorsData, initialData } from '@/services/dashboard/get-indicators-data';
import { useQuery } from '@tanstack/react-query';
import { IdCard, ServerIcon, User, ZapIcon } from 'lucide-react';

function Dashboard() {

    const {data, isFetching} = useQuery({ queryKey: ['get-indicators-data'], queryFn: getIndicatorsData, 
        initialData: initialData
    })

    const fields = [
        {
            label: 'OLTs',
            icon: ServerIcon
        },
        {
            label: 'Usuarios',
            icon: User 
        },
        {
            label: 'Grupos',
            icon: IdCard 
        },
        {
            label: 'Interações',
            icon: ZapIcon 
        }
    ]

    const mappedData = data?.map((item, index) => ({
        ...item,
        ...fields[index]
    }));

  return (
    <ContentLayout title='Dashboard'>
      <section id='card-informations' className='grid grid-cols-4 gap-5'>
        {mappedData?.map((item, index) => (
        <IndicatorsDashboard
            loading={isFetching}
            item={item}
            key={index}
        />
        ))}
      </section>
    </ContentLayout>
  );
}

export default Dashboard;
