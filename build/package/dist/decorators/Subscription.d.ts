import { ReturnTypeFunc, AdvancedOptions, SubscriptionFilterFunc, SubscriptionTopicFunc } from "./types";
export interface SubscriptionOptions extends AdvancedOptions {
    topics: string | string[] | SubscriptionTopicFunc;
    filter?: SubscriptionFilterFunc;
}
export declare function Subscription(options: SubscriptionOptions): MethodDecorator;
export declare function Subscription(returnTypeFunc: ReturnTypeFunc, options: SubscriptionOptions): MethodDecorator;
