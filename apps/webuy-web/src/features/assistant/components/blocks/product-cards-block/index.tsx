"use client";

import Image from "next/image";
import { Button, Icon, Skeleton, Text } from "@kiichan/design-system";
import { useQueries } from "@tanstack/react-query";
import type { ProductCardsBlock } from "@/features/assistant/schema";
import { useFormatMoney } from "@/features/shell/hooks/use-format-money";
import type { Locale } from "@/i18n/types";
import { fetchProduct } from "@/lib/client-api";
import { queryKeys, staleTimes } from "@/lib/query-keys";

interface AssistantProductCardsBlockProps {
  block: ProductCardsBlock;
  locale: Locale;
  onNavigate: (href: string) => void;
}

export const AssistantProductCardsBlock = ({
  block,
  locale,
  onNavigate,
}: AssistantProductCardsBlockProps) => {
  const { format } = useFormatMoney();
  const productQueries = useQueries({
    queries: block.products.map((item) => ({
      queryKey: queryKeys.products.detail(String(item.id)),
      queryFn: () => fetchProduct(item.id),
      staleTime: staleTimes.products,
    })),
  });

  return (
    <ul className="flex flex-col gap-3">
      {block.products.map((item, index) => {
        const query = productQueries[index];
        const product = query?.data;
        const isPending = query?.isPending ?? true;

        if (isPending) {
          return (
            <li
              key={item.id}
              className="flex min-h-30 gap-3 rounded-xl bg-primary-50/60 p-3"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                {item.reason ? (
                  <Text variant="caption" className="text-neutral-600">
                    {item.reason}
                  </Text>
                ) : (
                  <Skeleton className="h-3 w-1/2" />
                )}
                <Skeleton className="h-9 w-28" />
              </div>
            </li>
          );
        }

        if (query?.isError || !product) {
          return (
            <li
              key={item.id}
              className="min-h-30 rounded-xl bg-primary-50/60 p-3"
            >
              <Text variant="caption" className="text-neutral-600">
                Product #{item.id} is unavailable.
              </Text>
            </li>
          );
        }

        return (
          <li
            key={item.id}
            className="flex min-h-30 gap-3 rounded-xl bg-primary-50/60 p-3"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-primary-100">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <Text
                  variant="subtitle2"
                  className="line-clamp-2 text-neutral-900"
                >
                  {product.title}
                </Text>
                <Text variant="body2" className="font-medium text-neutral-900">
                  {format(product.price)}
                </Text>
                {product.rating != null ? (
                  <Text
                    variant="caption"
                    className="flex items-center gap-1 text-neutral-600"
                  >
                    <Icon
                      icon="mdi:star"
                      className="h-3.5 w-3.5 text-primary"
                    />
                    {product.rating}
                  </Text>
                ) : null}
                {item.reason ? (
                  <Text variant="caption" className="text-neutral-600">
                    {item.reason}
                  </Text>
                ) : null}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onNavigate(`/${locale}/products/${product.id}`)}
              >
                View product
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
