import { Card, CardContent } from '@/components/ui/card';
import NumberTicker from '@/components/ui/number-ticker';
import { LucideProps } from 'lucide-react';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface Item {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    label: string;
    value: number;
}

interface IndicatorsDashboardProps {
    item: Item;
    loading: boolean;
}

export function IndicatorsDashboard({ item,loading }: IndicatorsDashboardProps) {

    if(loading){
        return (
            <Card className='bg-primary'>
            <div className='text-lg flex flex-row items-center gap-2 px-5 py-5 h-18'>
            <Skeleton className='h-6 w-6 rounded-full bg-white' />
            <Skeleton className='h-6 w-28 bg-white' />
              
            </div>
            <CardContent>
            <Skeleton className='h-10 w-full bg-white' />
            </CardContent>
        </Card>
        )
    }



    return (  
        <Card className='bg-primary'>
            <div className='text-lg flex flex-row items-center gap-2 px-5 py-5 h-18'>
                <item.icon size={24} className='text-white' />
                <span className='text-white'>
                {item.label}
                </span>
            </div>
            <CardContent>
                <NumberTicker value={item.value} className='text-4xl font-bold text-white' decimalPlaces={0} />
            </CardContent>
        </Card>
    );
}

