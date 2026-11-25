import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { GhRelayRouteFacts } from "../domain/index.js";
import { StoreRouteFacts, type StoreRouteFactsDeps } from "../relay-answer/store-facts.js";

export type GhRelayRouteFactsService = Layer.Success<
	ReturnType<typeof GhRelayRouteFacts.toLayer>
>;

export const GhRelayRouteFactsFailClosed = GhRelayRouteFacts.toLayer(
	Effect.succeed({
		loadFacts: () =>
			Effect.succeed({
				fleet: null,
				ownerCanRead: false,
			}),
	}),
);

export const createGhRelayRouteFactsFromStore = (
	deps: StoreRouteFactsDeps,
): Layer.Layer<GhRelayRouteFactsService> =>
	GhRelayRouteFacts.toLayer(
		Effect.gen(function* () {
			const store = new StoreRouteFacts(deps);
			return {
				loadFacts: () =>
					Effect.gen(function* () {
						const loaded = yield* Effect.promise(() => store.facts(deps.readers));
						return {
							fleet: loaded.fleet,
							ownerCanRead: loaded.ownerCanRead,
						};
					}),
			};
		}),
	);
