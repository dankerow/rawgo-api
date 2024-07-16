import cluster from 'node:cluster'

if (cluster.isPrimary) {
  import('./cluster/primary')
} else {
  import('./cluster/worker')
}
