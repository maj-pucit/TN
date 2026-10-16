"use client";
import { useState } from "react";
import { Page, PageHeader, Section, SectionHeader, Text } from "../primitives";
import { Status, Table } from "../ui/Table";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Confirm } from "../ui/Confirm";
import { PayModal, CardRow } from "../ui/CardPicker";
import c from "../ui/cards.module.css";
import { bmk } from "@/data/brandmarks";
import { Icon } from "../Icon";
import { useDemo } from "@/lib/demo";
import { payments, type Payment } from "@/data/payments";
import { SAVED_CARDS } from "@/data/interviews";
import s from "./payments.module.css";

/* /candidate/payments/ — Phase 1 V.billing: Previous Transactions (receipt
   opens as a modal, never a page) and Your Cards (Add a Card = the Stripe
   picture; Remove confirms first). */
export function PaymentsPage() {
  const { stage } = useDemo();
  const rows = payments(stage);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [cards, setCards] = useState(SAVED_CARDS);
  const [remove, setRemove] = useState<string | null>(null);
  const [add, setAdd] = useState(false);
  return (
    <Page>
      <PageHeader title="Payments" desc="Your past payments and receipts, and the cards saved to your account." />
      <Section>
        <SectionHeader title="Previous Transactions" />
        {/* The shared admin table (Maryam 16 Oct 2026): equal columns, all left-aligned. */}
        <Table even rows={rows} rowKey={(p) => p.item + p.date} cols={[
          { key: "i", label: "Paid For", cell: (p) => p.item },
          { key: "d", label: "Paid On", cell: (p) => p.date },
          { key: "c", label: "Card", cell: (p) => (p.card ? <span className={s.c}><span className={s.bmk} dangerouslySetInnerHTML={{ __html: bmk(p.brand ?? "card") }} />•••• {p.card}</span> : "—") },
          { key: "a", label: "Amount", cell: (p) => p.amount },
          { key: "r", label: "Receipt", cell: (p) => <button type="button" className={s.lnk} onClick={() => setReceipt(p)}>View Receipt</button> },
        ]} />
      </Section>
      <Section>
        <SectionHeader title="Your Cards" actions={<Button kind="ghost" icon="add" asIs onClick={() => setAdd(true)}>Add a Card</Button>} />
        <div className={c.stack}>
          {cards.map((card) => (
            <CardRow key={card.last4} c={card} on={!!card.def}
              action={<button type="button" className={s.del} onClick={() => setRemove(card.last4)}><Icon name="delete" />Remove</button>} />
          ))}
        </div>
      </Section>

      {receipt && (
        <Modal label="Receipt" onClose={() => setReceipt(null)} footer={<Button kind="secondary" onClick={() => setReceipt(null)}>Close</Button>}>
          <div className={s.rec}>
            <Text role="h3">TalentNext Receipt</Text>
            <div className={s.kv}>
              <Text role="compact" as="span" ink="secondary">Paid for</Text><Text role="compact" as="span" strong>{receipt.item}</Text>
              <Text role="compact" as="span" ink="secondary">Date</Text><Text role="compact" as="span" strong>{receipt.date}</Text>
              <Text role="compact" as="span" ink="secondary">Card</Text><Text role="compact" as="span" strong>{receipt.card ? `${receipt.brand} •••• ${receipt.card}` : "—"}</Text>
              <Text role="compact" as="span" ink="secondary">Amount</Text><Text role="compact" as="span" strong>{receipt.amount}</Text>
              <Text role="compact" as="span" ink="secondary">Status</Text><Status tone="green">Paid</Status>
            </div>
          </div>
        </Modal>
      )}
      {remove && (
        <Confirm icon="delete" title="Remove this card?" danger ok="Remove"
          desc={`The card ending ${remove} will be removed from your account.`}
          onCancel={() => setRemove(null)} onOk={() => { setCards((cs) => cs.filter((c) => c.last4 !== remove)); setRemove(null); }} />
      )}
      {add && <PayModal onClose={() => setAdd(false)} />}
    </Page>
  );
}
