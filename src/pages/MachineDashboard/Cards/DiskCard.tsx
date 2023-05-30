import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import _ from 'lodash';

import SpaceChart from '@/components/Charts/SpaceChart';
import { DiskMetricInfo } from '@/utils/interface';
import { getClusterPrefix } from '@/utils/promQL';
import { asyncBatchQueries } from '@/requests';

interface IProps {
  cluster?: any;
  instance: string;
}

const DiskCard = forwardRef((props: IProps, ref) => {
  const { cluster, instance } = props;

  const [diskUsageDetails, setDiskUsageDetails] = useState<DiskMetricInfo[]>([]);

  useEffect(() => {
    if (cluster?.id) {
      asyncGetDiskUsageDetails();
    }
  }, [instance, cluster]);

  useImperativeHandle(ref, () => (
    {
      handleRefresh: () => asyncGetDiskUsageDetails()
    }
  ));
  
  const asyncGetDiskUsageDetails = async () => {
    console.log('instance', instance)
    const clusterSuffix1 = cluster ? `,${getClusterPrefix()}="${cluster.id}"` : '';
    const instanceSuffix = instance!=='all'?`, instance=~"^${instance.replaceAll(".", "\.")}.*"`:'';
    const queries: any = [
      {
        refId: 'diskSize',
        query: `node_filesystem_size_bytes{mountpoint !~".*pod.*"${clusterSuffix1}${instanceSuffix}}`
      },
      {
        refId: 'diskUsed',
        query: `node_filesystem_size_bytes{mountpoint !~".*pod.*"${clusterSuffix1}${instanceSuffix}} - node_filesystem_free_bytes{mountpoint !~".*pod.*"${clusterSuffix1}${instanceSuffix}}`
      }
    ];
    const data = await asyncBatchQueries(queries);
    const { results } = data as any;
    const details = results.diskSize.result.map(item => {
      const metricItem = results.diskUsed.result.find(usedItem => usedItem.metric.device === item.metric.device && usedItem.metric.instance === item.metric.instance);
      let used = 0;
      if (metricItem) {
        used = parseInt(metricItem.value[1]);
      }
      return {
        size: parseInt(item.value[1]),
        device: item.metric.device,
        mountpoint: item.metric.mountpoint,
        used,
        name: item.metric.instance.split(':')[0],
      }
    });
    setDiskUsageDetails(details);
    return details;
  }

  return (
    <div className="disk-detail detail-card">
      <SpaceChart diskInfos={diskUsageDetails} />
    </div>
  );
}) 

export default DiskCard;
