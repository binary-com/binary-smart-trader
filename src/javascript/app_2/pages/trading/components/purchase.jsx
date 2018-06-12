import React           from 'react';
import PropTypes       from 'prop-types';
import { toGMTFormat } from '../../../common/date_time';
import Button          from '../../../components/form/button.jsx';
import Tooltip         from '../../../components/elements/tooltip.jsx';
import Fieldset        from '../../../components/form/fieldset.jsx';
import { connect }     from '../../../store/connect';
import { isLoggedIn }  from '../../../../_common/base/client_base';
import { localize }    from '../../../../_common/localize';
import Url             from '../../../../_common/url';
import {
    getPropertyValue,
    isEmptyObject }    from '../../../../_common/utility';

// TODO: update/remove this once the design is ready
const createPurchaseInfo = (purchase_info) => (
    <React.Fragment>
        <div><strong>Purchase Info:</strong></div>
        <div>Buy Price: {purchase_info.buy_price}</div>
        <div>Payout: {purchase_info.payout}</div>
        <div>Start: {toGMTFormat(purchase_info.start_time * 1000)}</div>
        <div>Contract ID: {purchase_info.contract_id}</div>
        <div>Transaction ID: {purchase_info.transaction_id}</div>
        <div>Description: {purchase_info.longcode}</div>
    </React.Fragment>
);

const Purchase = ({
    is_purchase_enabled,
    is_trade_enabled,
    onClickPurchase,
    proposal_info,
    purchase_info,
    trade_types,
}) => (
    Object.keys(trade_types).map((type, idx) => {
        const info = proposal_info[type] || {};
        const is_logged_in = isLoggedIn();

        return (
            <Fieldset className='purchase-option' key={idx} header={type} tooltip={info.message}>
                {(!isEmptyObject(purchase_info) && purchase_info.echo_req.buy === info.id) ?
                    <div>
                        {getPropertyValue(purchase_info, ['error', 'message']) || createPurchaseInfo(purchase_info.buy)}
                    </div>
                    :
                    <React.Fragment>
                        {(info.has_error || !info.id) ?
                            <div>{info.message}</div>
                            :
                            <div className='box'>
                                <div className='left-column'>
                                    <img
                                        className='type'
                                        src={Url.urlForStatic(`images/trading_app/purchase/trade_types/ic_${trade_types[type].toLowerCase()}_light.svg`) || undefined}
                                    />
                                    <h4 className='trade-type'>{type.toLowerCase()}</h4>
                                </div>
                                <div className='right-column'>
                                    <span>{localize('Return')}: {info.returns}%</span>
                                    <span>{localize('Stake')}: {info.stake}</span>
                                    <span>{localize('Net Profit')}: {info.profit}</span>
                                    <span>{localize('Payout')}: {info.payout}</span>
                                </div>
                            </div>
                        }
                        <div className='submit-section'>
                            <Tooltip
                                alignment='left'
                                message={info.message}
                            >
                                <Button
                                    is_disabled={!is_purchase_enabled || !is_trade_enabled || !info.id || !is_logged_in}
                                    id={`purchase_${type}`}
                                    className='primary green'
                                    has_effect
                                    text={is_logged_in ? `${localize('Purchase')} ${trade_types[type]}` : localize('Please log in.')}
                                    onClick={() => { onClickPurchase(info.id, info.stake); }}
                                />
                            </Tooltip>
                        </div>
                    </React.Fragment>
                }
            </Fieldset>
        );
    })
);

Purchase.propTypes = {
    is_purchase_enabled: PropTypes.bool,
    is_trade_enabled   : PropTypes.bool,
    onClickPurchase    : PropTypes.func,
    proposal_info      : PropTypes.object,
    purchase_info      : PropTypes.object,
    trade_types        : PropTypes.object,
};

Tooltip.propTypes= {
    alignment: PropTypes.string,
    message  : PropTypes.string,
};

export default connect(
    ({ trade }) => ({
        is_purchase_enabled: trade.is_purchase_enabled,
        is_trade_enabled   : trade.is_trade_enabled,
        onClickPurchase    : trade.onPurchase,
        proposal_info      : trade.proposal_info,
        purchase_info      : trade.purchase_info,
        trade_types        : trade.trade_types,
    })
)(Purchase);
