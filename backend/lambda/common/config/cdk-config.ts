import cdkDev from '../../../../admin/src/configs/cdk-dev.json'
import cdkProd from '../../../../admin/src/configs/cdk-prod.json'

export const CDK_CONFIGS = process.env.STAGE === 'dev' ? cdkDev["Beatverse-dev-FullStack"] : cdkProd["Beatverse-prod-FullStack"];
