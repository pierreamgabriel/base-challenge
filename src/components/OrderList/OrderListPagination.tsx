interface OrderListPaginationProps {
  page: number;
  pagesTotal: number;
  setPages: (value: React.SetStateAction<number>) => void;
}
export const OrderListPagination = ({
  page,
  pagesTotal,
  setPages,
}: OrderListPaginationProps) => {
  return (
    <div
    className="flex justify-center mt-[1rem]"
    >
      <button
        onClick={() => setPages(page - 1)}
        disabled={page === 1}
        className="border border-black rounded p-[2px] w-[25px] disabled:bg-gray-300 cursor-pointer"
      >
        &lt;
      </button>
      <span style={{ margin: "0 1rem" }}>
        Página {page} de {pagesTotal}
      </span>
      <button
        onClick={() => setPages(page + 1)}
        disabled={page === pagesTotal}
        className={
          "border border-black rounded p-[2px] w-[25px] disabled:bg-gray-300 cursor-pointer"
        }
      >
        &gt;
      </button>
    </div>
  );
};
