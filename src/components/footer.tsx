import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full flex flex-col rounded-t-[12px] bg-muted p-12 font-[inter]">
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 container">
          <div className="flex justify-between">
            <div className="w-full flex flex-col gap-4">
              <h1 className="text-[64px] font-medium italic font-[playfair]">
                WellWet
              </h1>
              <p className="text-base opacity-50">
                Holistic-корм для собак и кошек.
                <br />
                Натуральный состав и контроль качества на каждом этапе
                производства.
              </p>
            </div>
            <div className="w-full flex flex-col items-end">
              <div className="w-41.25 flex flex-col gap-4">
                <p className="text-base font-medium">Разделы</p>
                <div className="flex flex-col gap-2">
                  <Link className="text-[14px]" href="/products">
                    Продукты
                  </Link>
                  <Link className="text-[14px]" href="/about_food">
                    О корме
                  </Link>
                  <Link className="text-[14px]" href="/compound">
                    Состав
                  </Link>
                  <Link className="text-[14px]" href="/contacts">
                    Контакты
                  </Link>
                  <Link className="text-[14px]" href="/for_partners">
                    Партнерам
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr className="w-full border-border/50" />
        </div>
      </div>
    </div>
  );
}
